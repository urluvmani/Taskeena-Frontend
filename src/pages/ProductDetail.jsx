import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/More/SEO";
import { useCart } from "../components/context/Cart";
import { Star } from "lucide-react";
import { useAuth } from "../components/context/authContext";
import toast, { Toaster } from "react-hot-toast"; // ✅ include Toaster

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { addToCart } = useCart();
  const { auth } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const getProductDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${
          params.slug
        }`
      );
      setProduct(data?.product);
      getRelatedProducts(data?.product?._id, data?.product?.category);
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
  };

  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/related-products/${pid}/${cid}`
      );
      if (data?.success) setRelatedProducts(data?.relatedproducts);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.AllCategory);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchReviews = async () => {
    if (!product?._id) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/review/${product._id}`
      );
      setReviews(data || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/review/add/${product._id}`,
        { rating, comment },
        { headers: { Authorization: auth?.token } }
      );
      if (data?.success) {
        toast.success("Review added successfully!");
        setComment("");
        setRating(5);
        fetchReviews();
      } else toast.error(data?.message || "Failed to add review");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "You can only review purchased products"
      );
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getProductDetails();
      getAllCategories();
    }
  }, [params?.slug]);

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
    }
  }, [product?._id, auth?.token]);

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500 bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading product details...</p>
      </div>
    );
  }

  const renderStars = (value) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < value ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }
      />
    ));

  return (
    <>
      <SEO
        title={`${product?.name} | Taskeena Beauty`}
        description={
          product?.description?.substring(0, 160) ||
          "Discover premium beauty, skincare, and wellness essentials at Taskeena Beauty."
        }
      />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 text-gray-800 px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-rose-500 text-white shadow hover:opacity-90 transition"
        >
          ← Back
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center items-center bg-white/80 rounded-2xl shadow-lg p-8 border border-emerald-100">
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }/api/v1/product/product-photo/${product._id}`}
              alt={product?.name}
              loading="lazy"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold text-emerald-700">
              {product.name}
            </h1>

            <div className="flex items-center gap-1">
              {renderStars(Math.round(product.avgRating || 0))}
              <span className="text-gray-500 text-sm ml-2">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Replace this section */}
            <div className="mt-2">
              {product.discountPercent > 0 ? (
                <div>
                  <span className="line-through text-gray-400 text-sm">
                    Rs. {product.price}
                  </span>
                  <div className="text-rose-500 font-bold">
                    Rs.{" "}
                    {(
                      product.price -
                      (product.price * product.discountPercent) / 100
                    ).toFixed(0)}{" "}
                    ({product.discountPercent}% OFF)
                  </div>
                </div>
              ) : (
                <div className="md:text-xl text-base font-bold text-emerald-700">
                  Rs. {product.price}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">Category:</span>{" "}
              {categories.find((c) => c._id === product.category)?.name ||
                "Unknown"}
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">
                Available Quantity:
              </span>{" "}
              {product.quantity > 0 ? product.quantity : "Out of Stock"}
            </p>

            <button
              onClick={() => {
                if (auth?.token) {
                  addToCart(product);
                  toast.success("Product added to cart");
                } else navigate("/login");
              }}
              className={`px-6 py-3 rounded-lg font-medium shadow-md border text-white ${
                parseInt(product?.quantity?.$numberInt ?? product?.quantity) <=
                0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-rose-500 hover:opacity-90 transition"
              }`}
              disabled={
                parseInt(product?.quantity?.$numberInt ?? product?.quantity) <=
                0
              }
            >
              Add to Cart
            </button>

            <div>
              <h2 className="font-semibold text-lg text-emerald-700 mb-2">
                Description
              </h2>
              <div className="max-h-64 overflow-y-auto text-sm text-gray-700 p-3 rounded-md bg-white border border-emerald-100">
                {product.description || "No description available."}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16  mx-auto">
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
            Customer Reviews
          </h3>
          <div className="flex md:flex-row flex-col items-start justify-between w-full gap-5">
            <div className=" shadow-2xl w-[90vw] md:w-1/2 p-5 rounded-md max-h-[60vh] overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r._id}
                      className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
                    >
                      <p className="font-bold text-emerald-700">
                        {r.user?.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(r.rating)}
                      </div>
                      <p className="text-gray-700 mt-2">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="Form w-[90vw]  md:w-1/2 mx-auto">
              {auth?.token && (
                <form
                  onSubmit={handleSubmitReview}
                  className="mt-8 p-6 bg-white border border-emerald-100 rounded-lg shadow-md"
                >
                  <label className="block font-medium mb-1 text-emerald-700">
                    Rating:
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-emerald-200 p-2 rounded w-24 mb-4"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <label className="block font-medium mb-1 text-emerald-700">
                    Comment:
                  </label>
                  <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border border-emerald-200 w-full p-2 rounded h-28 mb-4"
                  />

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-emerald-800 mb-10 text-center">
            Related Products
          </h2>

          {relatedProducts?.length === 0 ? (
            <p className="text-center text-gray-500">
              No related products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100 hover:-translate-y-1 hover:shadow-xl transition transform"
                >
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    loading="lazy"
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-emerald-800 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.description?.substring(0, 80)}...
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      {/* Replace this section */}
                      <div className="mt-2">
                        {product.discountPercent > 0 ? (
                          <div>
                            <span className="line-through text-gray-400 text-sm">
                              Rs. {product.price}
                            </span>
                            <div className="text-rose-500 font-bold">
                              Rs.{" "}
                              {(
                                product.price -
                                (product.price * product.discountPercent) / 100
                              ).toFixed(0)}{" "}
                              ({product.discountPercent}% OFF)
                            </div>
                          </div>
                        ) : (
                          <div className="md:text-xl text-base font-bold text-emerald-700">
                            Rs. {product.price}
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-gray-400">
                        {p.quantity > 0 ? `In stock (${p.quantity})` : "Out"}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/details/${p.slug}`)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-rose-500 text-white text-sm px-3 py-2 rounded-md hover:opacity-90 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          if (auth?.token) addToCart(p);
                          else navigate("/login");
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                          p.quantity <= 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        }`}
                        disabled={p.quantity <= 0}
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
