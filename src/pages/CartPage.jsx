import React from "react";
import { useCart } from "../components/context/Cart.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/authContext.jsx";
import Swal from "sweetalert2";
import SEO from "../components/More/SEO";
import toast, { Toaster } from "react-hot-toast";

const CartPage = () => {
  const { auth } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  // ✅ Helper to parse MongoDB price object
  const parsePrice = (p) => {
    if (p == null) return 0;
    if (typeof p === "object") {
      if (p.$numberInt) return Number(p.$numberInt);
      if (p.$numberDecimal) return Number(p.$numberDecimal);
      if (p.$numberLong) return Number(p.$numberLong);
    }
    return Number(p);
  };

  // 🆕 New Helper to calculate discounted price (This solves your issue)
  const getDiscountedPrice = (item) => {
    const rawPrice = parsePrice(item.price);
    const discountPercent = Number(item.discountPercent) || 0;

    if (discountPercent > 0) {
      // Calculate discounted price
      return rawPrice - (rawPrice * discountPercent) / 100;
    }
    return rawPrice;
  };

  // ✅ UPDATED: Calculate total price using the discounted price
  const totalPrice = cart.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * (item.quantity || 1),
    0
  );

  // Helper for displaying total price with currency formatting
  const formattedTotalPrice = totalPrice.toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });

  // ✅ Original functionality restored
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Make sure to update localStorage too!
  };

  // ✅ Original functionality restored
  const handleCheckout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth?.token,
          },
          body: JSON.stringify({ cart, totalPrice }),
        }
      );

      const html = await res.text();

      if (res.ok) {
        setCart([]);
        localStorage.removeItem("cart");

        Swal.fire({
          title: "Order Successful!",
          html: html,
          icon: "success",
          timer: 10000,
          showConfirmButton: false,
        });
      } else {
        console.error("Server error:", html);
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("An error occurred during checkout.");
    }
  };

  return (
    <>
      {/* ✅ SEO for Cart Page */}
      <SEO
        title="Your Shopping Cart | Taskeena Beauty"
        description="View and manage your Taskeena Beauty cart. Checkout securely with Cash on Delivery. Glow Inside & Out with premium beauty and wellness products."
        keywords="cart, shopping cart, Taskeena Beauty, checkout, skincare, wellness, COD, beauty store"
      />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <h1 className="text-3xl font-extrabold text-center text-emerald-700 mb-8">
            🛒 Your Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center flex flex-col justify-center items-center text-gray-600">
              <p>Your cart is empty.</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-rose-500 text-white rounded-lg font-medium shadow hover:opacity-90"
                >
                  Go Shopping
                </button>
                <button
                  onClick={() => navigate("/dashboard/user/orders")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-rose-500 text-white rounded-lg font-medium shadow hover:opacity-90"
                >
                  My Orders
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cart.map((item) => {
                  // Calculations for display
                  const originalPrice = parsePrice(item.price);
                  const discountedPrice = getDiscountedPrice(item); // Use the new function
                  const itemTotal = discountedPrice * (item.quantity || 1);

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={`${
                            import.meta.env.VITE_API_URL
                          }/api/v1/product/product-photo/${item._id}`}
                          alt={`${item.name} – Taskeena product`}
                          loading="lazy"
                          className="w-24 h-24 object-cover rounded-lg border shadow-sm hover:scale-105 transition-transform"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.description?.slice(0, 60) || "No description"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity || 1}
                          </p>

                          {/* ✅ Discounted Price Display */}
                          {item.discountPercent > 0 && (
                            <div className="flex items-end gap-2">
                              <span className="text-xs text-gray-400 line-through">
                                PKR {originalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm font-medium text-rose-500">
                                ({item.discountPercent}% OFF)
                              </span>
                            </div>
                          )}
                          <p className="mt-1 font-semibold text-rose-500 md:text-lg">
                            Total: PKR {itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          removeFromCart(item._id);
                          toast.success("Product removed from cart");
                        }}
                        className="px-4 py-2 text-sm bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ✅ Address Section (Functionality preserved) */}
              <div className="mt-10 bg-gradient-to-r from-emerald-50 to-rose-50 border border-emerald-200 rounded-xl p-5 shadow-inner">
                <h2 className="text-lg font-bold text-emerald-700 mb-2">
                  Shipping Address
                </h2>

                {auth?.user?.address ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-medium text-emerald-700">
                        {auth?.user?.name}
                      </span>
                      <br />
                      {auth?.user?.address}
                    </p>
                    <button
                      className="bg-gradient-to-r from-emerald-500 to-rose-500 text-white font-semibold rounded-full px-5 py-2 shadow hover:opacity-90 transition"
                      onClick={() => navigate("/dashboard/user/update-profile")}
                    >
                      Update Address
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {auth?.token ? (
                      <button
                        className="bg-gradient-to-r from-emerald-500 to-rose-500 text-white font-semibold rounded-full px-6 py-2 shadow hover:opacity-90 transition"
                        onClick={() =>
                          navigate("/dashboard/user/update-profile")
                        }
                      >
                        Add Address to Checkout
                      </button>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-emerald-500 to-rose-500 text-white font-semibold rounded-full px-6 py-2 shadow hover:opacity-90 transition"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Please Login to Checkout
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ Checkout Summary Section (Total updated to show discounted price) */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t pt-6">
                <div className="text-xl font-semibold text-gray-700">
                  Total:{" "}
                  <span className="text-rose-500">
                    {formattedTotalPrice} {/* Using formattedTotalPrice */}
                  </span>
                </div>

                <div className="flex flex-col items-center font-semibold text-gray-700 text-sm">
                  <div>
                    <span className="text-emerald-600">Method: </span>
                    <span className="text-yellow-600">Cash on Delivery</span>
                  </div>
                  <div className="text-red-400 opacity-60 text-xs">
                    Currently online payment is unavailable
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCheckout();
                    toast.success("Proceeding Order ");
                  }}
                  className="mt-4 sm:mt-0 px-8 py-3 bg-gradient-to-r from-emerald-500 to-rose-500 text-white font-semibold rounded-full shadow hover:opacity-90 transition"
                >
                  Order Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
