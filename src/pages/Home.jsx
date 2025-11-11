import React, { useEffect, useState } from "react";
import SEO from "../components/More/SEO";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../components/context/Cart.jsx";
import { useAuth } from "../components/context/authContext.jsx";
import toast, { Toaster } from "react-hot-toast"; // ✅ include Toaster


const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  // ✅ Helpers
  const parsePrice = (p) => {
    if (p == null) return null;
    if (typeof p === "object") {
      if (p.$numberInt) return Number(p.$numberInt);
      if (p.$numberDecimal) return Number(p.$numberDecimal);
      if (p.$numberLong) return Number(p.$numberLong);
    }
    return Number(p);
  };

  const formatCurrency = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ✅ API Calls
  const getTotal = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/product/product-count`
    );
    setTotal(data?.total);
  };

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-page/${page}`
      );
      setProducts(data?.products);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-page/${page}`
      );
      setProducts([...products, ...data?.products]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page !== 1) loadMore();
  }, [page]);

  const getAllCategories = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
    );
    setCategories(data?.AllCategory);
  };

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    else getAllProducts();
  }, [checked, radio]);

  useEffect(() => {
    getTotal();
    getAllCategories();
  }, []);

  const setFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  const filterProduct = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/product/product-filters`,
      { checked, radio }
    );
    if (data?.success) setProducts(data?.products);
  };

  // ✅ Add to Cart (toast-based)
  const handleAddToCart = (product) => {
    if (!auth?.token) {
      toast.error("Please log in first to add products to cart.");
      return navigate("/login");
    }

    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  return (
    <>
      <SEO
        title="Taskeena Beauty – Glow Inside & Out"
        description="Explore premium skincare, wellness, and medicated essentials for a healthier, radiant you."
        keywords="skincare, wellness, supplements, medicated products, Taskeena"
      />

      {/* ✅ Toast container (required once) */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 py-4 via-white to-emerald-50">
        {/* HERO SECTION */}
        <section className="relative  w-[85%] mx-auto md:h-[50vh] h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-md">
          <img
            src="banner.webp"
            loading="lazy"
            alt="Beauty banner"
            className="absolute inset-0 w-full h-full rounded-2xl object-cover brightness-75"
          />
          <div className="relative text-center h-[400px] px-6 md:px-12 text-white z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
            >
              Beauty Meets Wellness
            </motion.h1>
            <p className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-lg md:text-xl mb-6 font-serif shadow">
              Discover dermatologically tested skincare and self-care essentials
              made to nourish, heal, and glow.
            </p>
            <button
              onClick={() =>
                window.scrollBy({
                  top: window.innerHeight * 1.3,
                  behavior: "smooth",
                })
              }
              className="bg-gradient-to-r from-rose-500 to-emerald-500 px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* FILTER + PRODUCT GRID */}
        <div className="flex flex-col mt-10 lg:flex-row">
          {/* LEFT FILTER PANEL */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:w-[22%] w-full bg-white/95 backdrop-blur-md shadow-xl rounded-r-3xl p-6 space-y-8 border-r border-emerald-200"
          >
            <div>
              <h2 className="text-center text-xl font-bold text-emerald-700 mb-3 uppercase tracking-wide">
                Filter by Category
              </h2>
              <div className="flex flex-col space-y-3 p-2">
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => setFilter(e.target.checked, c._id)}
                    className="text-gray-700 font-medium hover:text-emerald-600 transition"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-center text-xl font-bold text-emerald-700 mb-3 uppercase tracking-wide">
                Filter by Price
              </h2>
              <div className="flex flex-col p-2 space-y-2">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array} className="text-gray-700">
                        {p.name}
                      </Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <button
                onClick={() => {
                  window.location.reload();
                  toast("Filters cleared");
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-rose-400 text-white font-semibold py-2 rounded-lg mt-5 hover:opacity-90 shadow-md transition-all"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* RIGHT PRODUCT GRID */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-[78%] w-full p-6"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-emerald-800">
                Featured Beauty & Health Products
              </h2>
              <p className="text-gray-500 mt-2">
                Curated to care for your body, skin, and mind.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-3 gap-8">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-4 bg-white rounded-2xl shadow-md"
                  >
                    <div className="h-44 bg-slate-100 rounded mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                    <div className="h-8 bg-slate-100 rounded w-full mt-4" />
                  </div>
                ))}

              {!loading && products.length === 0 && (
                <div className="col-span-full text-center text-slate-500 py-12">
                  No products found.
                </div>
              )}

              {!loading &&
                products.map((product, index) => {
                  const rawPrice = parsePrice(product?.price);
                  const priceText = formatCurrency(rawPrice);
                  const discounted =
                    product.discountPercent > 0
                      ? rawPrice - (rawPrice * product.discountPercent) / 100
                      : rawPrice;

                  return (
                    <article
                      key={`${product?._id ?? product?.id ?? "product"}-${index}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition shadow-emerald-200"
                    >
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`}
                          loading="lazy"
                          alt={product?.name ?? "product"}
                          className="w-full h-44 md:h-52 object-cover hover:scale-105 transition-transform"
                        />
                        {/* Stock or Discount badge */}
                        {product.discountPercent > 0 ? (
                          <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                            {product.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-rose-500 text-white text-xs font-medium px-2 py-1 rounded-xl shadow">
                            {parseInt(
                              product?.quantity?.$numberInt ?? product?.quantity
                            ) > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        )}
                      </div>

                      <div className="px-3 py-2">
                        <h3 className="font-semibold text-emerald-800 uppercase">
                          {product?.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {product?.description ?? "No description available."}
                        </p>

                        <div className="mt-2">
                          {product.discountPercent > 0 ? (
                            <div>
                              <span className="line-through text-gray-400 text-sm">
                                Rs. {rawPrice}
                              </span>
                              <div className="text-rose-500 font-bold">
                                Rs. {discounted.toFixed(0)} (
                                {product.discountPercent}% OFF)
                              </div>
                            </div>
                          ) : (
                            <div className="md:text-xl text-base font-bold text-emerald-700">
                              Rs. {priceText}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 justify-between md:justify-center py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className={`md:px-3 py-2 px-2 text-sm rounded-lg font-medium shadow-sm border ${
                              parseInt(
                                product?.quantity?.$numberInt ?? product?.quantity
                              ) <= 0
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                                : "bg-white text-emerald-700 hover:bg-emerald-50"
                            }`}
                            disabled={
                              parseInt(
                                product?.quantity?.$numberInt ?? product?.quantity
                              ) <= 0
                            }
                          >
                            Buy now
                          </button>

                          <button
                            className="md:px-3 px-2 py-2 text-sm rounded-lg bg-emerald-600 text-white font-medium shadow hover:shadow-md"
                            onClick={() => navigate(`/details/${product.slug}`)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* LOAD MORE */}
            <div className="text-center mt-12">
              {products?.length < total && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                    toast("Loading more products...");
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-rose-400 text-white py-3 px-10 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? "Loading..." : "Load More"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* FOOTER CTA */}
        {!auth?.token && (
          <section className="bg-gradient-to-r from-emerald-600 to-rose-600 text-white text-center py-16 mt-16 rounded-t-[3rem]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Taskeena Wellness Circle 🌿
            </h2>
            <p className="mb-6 opacity-90">
              Sign up to receive beauty tips, exclusive discounts, and early
              access to new care lines!
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-emerald-50 transition"
            >
              Sign Up Now
            </button>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
