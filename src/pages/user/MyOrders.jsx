import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../components/context/authContext";
import SEO from "../../components/More/SEO";
import { Package, ShoppingBag } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // ✅ include Toaster
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
const navigate =  useNavigate()

  // ✅ Fetch orders from API
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/order/my-orders`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data) setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // ✅ Cancel order
  const handleDeleteOrder = async (orderId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmDelete) return;

      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/order/delete-order/${orderId}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data) {
        toast.success("Order cancelled successfully");
        getOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
    else navigate('/login')
  }, [auth?.token]);

  return (
    <>
      {/* ✅ SEO META TAGS */}
      <SEO
        title="My Orders | Taskeena Beauty"
        description="View your recent Taskeena Beauty purchases, track order status, and manage your skincare & wellness orders securely."
        keywords="my orders, order history, Taskeena Beauty, skincare, wellness, order tracking, customer dashboard"
      />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen md:w-auto w-[100vw] flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-emerald-50 text-gray-800 py-1">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-6xl border border-emerald-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2 sm:mb-0">
              <ShoppingBag className="w-7 h-7 text-emerald-600" />
              <h1 className="text-3xl font-extrabold tracking-wide text-emerald-700">
                My Orders
              </h1>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Manage your recent purchases with ease
            </span>
          </div>

          {/* ✅ Scrollable Orders */}
          <div className="overflow-y-auto bg-pink-200 rounded-2xl scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-emerald-100  max-h-[70vh]">
            {orders.length > 0 ? (
              <div className="space-y-8">
                {orders.map((order, i) => {
                  const {
                    _id,
                    status,
                    paymentStatus,
                    totalAmount,
                    buyer,
                    buyeraddress,
                    buyerphone,
                    products,
                    transactionId,
                    createdAt,
                  } = order;

                  return (
                    <div
                      key={_id || i}
                      className="p-6 rounded-2xl border border-emerald-100 bg-white/70 hover:bg-white/90 transition-all shadow-md"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-emerald-100 pb-3 mb-4">
                        <div>
                          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                            <Package className="inline w-5 h-5 text-emerald-600 mr-1" />
                            Order ID:{" "}
                            <span className="text-rose-500 break-words font-medium">
                              {transactionId}
                            </span>
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Status:{" "}
                            <span className="text-yellow-600">{status}</span> |{" "}
                            Payment:{" "}
                            <span
                              className={
                                paymentStatus === "Paid"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              {paymentStatus}
                            </span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <p className="text-xs sm:text-sm text-gray-400">
                            {new Date(createdAt).toLocaleString()}
                          </p>
                          <p className="font-bold text-lg sm:text-xl text-emerald-600">
                            Rs. {totalAmount}
                          </p>
                        </div>
                      </div>

                      {/* Buyer Info */}
                      <div className="text-sm sm:text-base mb-3 space-y-1 text-gray-700">
                        <p>
                          <span className="font-semibold">Buyer:</span>{" "}
                          {buyer?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {buyerphone}
                        </p>
                        <p className="text-sm text-gray-500 leading-snug">
                          {buyeraddress}
                        </p>
                      </div>

                      {/* Product List */}
                      <div className="border-t border-emerald-100 mt-4 pt-3">
                        <h3 className="font-semibold mb-2 text-base sm:text-lg text-emerald-700">
                          Products
                        </h3>
                        <ul className="space-y-3">
                          {products.map((p) => (
                            <li
                              key={p._id}
                              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-emerald-50 pb-2 text-sm sm:text-base"
                            >
                              <div className="w-full sm:w-2/3">
                                <p className="font-medium text-gray-700">
                                  {p.name}
                                </p>
                                <p className="font-medium text-gray-700">
                                  Quantity :{" "}
                                  <span className="text-orange-500 ">
                                    {p.quantity}
                                  </span>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                                  {p.description}
                                </p>
                              </div>
                              <p className="font-semibold text-rose-600 mt-1 sm:mt-0 sm:text-right">
                                Rs. {p.price}
                              </p>
                            </li>
                          ))}
                        </ul>

                        <div className="text-right mt-5">
                          <button
                            className="bg-gradient-to-r from-rose-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:opacity-90 transition-transform hover:scale-105"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-emerald-200 rounded-2xl bg-white/50 text-gray-500">
                <p className="text-lg font-medium">No orders found 🛍️</p>
                <p className="text-sm mt-2">
                  When you place an order, it will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
