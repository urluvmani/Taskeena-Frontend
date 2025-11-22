import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../components/context/authContext";
import PrintableInvoice from "./PrintableInvoice";
import toast from "react-hot-toast";

const Orders = () => {
  const { auth } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const invoiceRef = useRef();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Fetch all orders
  const GetAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/order/all-orders`,
        { headers: { Authorization: auth?.token } }
      );
      if (data?.success) setAllOrders(data?.Orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      toast.error("Error loading orders");
    }
  };

useEffect(() => {
  if (selectedOrder) {
    setTimeout(() => {
      handlePrint();
    }, 300);
  }
}, [selectedOrder]);

  const handlePrint = () => {
  if (!invoiceRef.current) return;

  const printContents = invoiceRef.current.innerHTML;
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
      </head>
      <body>${printContents}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


  // ✅ Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmed) return;

      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/order/delete-order/${orderId}`,
        { headers: { Authorization: auth?.token } }
      );

      if (data?.success) {
        toast.success("Order cancelled successfully");
        GetAllOrders();
      } else {
        toast.error(data?.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  // ✅ Calculate total earnings
  const calculateTotalEarnings = (orders) => {
    const total = orders.reduce((acc, order) => {
      if (order?.paymentStatus === "Paid") {
        const amount = Number(order?.totalAmount) || 0;
        return acc + amount;
      }
      return acc;
    }, 0);
    setTotalEarnings(total);
  };

  // ✅ Update payment status
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/order/update-payment-status/${orderId}`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: auth?.token } }
      );

      if (data?.success) {
        toast.success("Payment status updated!");
        GetAllOrders();
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Payment status update error:", error);
      toast.error("Error updating payment status");
    }
  };

  // ✅ Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/order/update-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: auth?.token } }
      );

      if (data?.success) {
        toast.success("Order status updated!");
        GetAllOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    if (auth?.token) GetAllOrders();
  }, [auth?.token]);

  useEffect(() => {
    setTotalOrder(allOrders.length);
    calculateTotalEarnings(allOrders);
  }, [allOrders]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          All Orders (Admin)
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
          <h2 className="text-lg sm:text-xl">
            Total Orders:{" "}
            <span className="text-yellow-300 font-semibold">{totalOrder}</span>
          </h2>
          <h2 className="text-lg sm:text-xl">
            Total Earnings:{" "}
            <span className="text-green-400 font-semibold">
              Rs. {totalEarnings.toLocaleString()}
            </span>
          </h2>
        </div>

        {/* Orders list */}
        <div className="overflow-y-auto max-h-[75vh] pr-1 sm:pr-2 space-y-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          {allOrders.length > 0 ? (
            allOrders.map((order) => {
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
                  key={_id}
                  className="p-5 rounded-xl border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-800 transition-all shadow-sm"
                >
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-neutral-700 pb-3 mb-4 gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">
                        Order ID:{" "}
                        <span className="text-pink-400">{transactionId}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400">
                        Payment:{" "}
                        <span
                          className={
                            paymentStatus === "Paid"
                              ? "text-green-400 font-medium"
                              : "text-red-400 font-medium"
                          }
                        >
                          {paymentStatus}
                        </span>
                      </p>
                    </div>

                    {/* Payment status dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="font-semibold text-sm">Payment:</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(_id, e.target.value)
                        }
                        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1 text-white text-sm focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
                    >
                      Delete
                    </button>
                    <button
  onClick={() => setSelectedOrder(order)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
>
  Print Invoice
</button>


                    {/* Timestamp and amount */}
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">
                        {new Date(createdAt).toLocaleString()}
                      </p>
                      <p className="font-semibold text-lg text-green-400">
                        Rs. {totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="text-sm sm:text-base mb-4 space-y-1">
                    <p>
                      <span className="font-semibold">Buyer:</span>{" "}
                      {buyer?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {buyerphone || "N/A"}
                    </p>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-snug">
                      {buyeraddress || "No address provided"}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="mb-4">
                    <label className="font-semibold mr-2 text-sm sm:text-base">
                      Order Status:
                    </label>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(_id, e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1 text-white text-sm sm:text-base focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Not Processed">Not Processed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Products List */}
                  <div className="border-t border-neutral-700 pt-3">
                    <h3 className="font-semibold mb-2 text-base sm:text-lg">
                      Products
                    </h3>
                    <ul className="divide-y divide-neutral-700">
                      {products.map((p) => (
                        <li
                          key={p._id}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 text-sm sm:text-base"
                        >
                          <div className="w-full sm:w-2/3">
                            <p className="font-medium">{p.name}</p>
                            <p>
                              Quantity:{" "}
                              <span className="text-yellow-400 font-medium">
                                {p.quantity}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-400 truncate">
                              {p.description}
                            </p>
                          </div>
                          <p className="font-semibold mt-1 sm:mt-0 text-right text-green-300">
                            Rs. {p.price}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-neutral-400 text-center py-16 border-2 border-dashed border-neutral-700 rounded-xl">
              No orders found
            </div>
          )}
        </div>
      </div>
      {/* Hidden printable invoice */}
<div style={{ display: "none" }}>
  <PrintableInvoice order={selectedOrder} ref={invoiceRef} />
</div>

    </div>
  );
};

export default Orders;
