import React from "react";

const PrintableInvoice = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  const {
    transactionId,
    buyer,
    buyeraddress,
    buyerphone,
    products,
    totalAmount,
    createdAt,
    paymentStatus,
    status,
  } = order;

  return (
    <div
      ref={ref}
      className="bg-white text-black p-8"
      style={{
        width: "800px",
        fontFamily: "Inter, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="flex justify-between items-start pb-6 border-b border-gray-300">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Taskeena</h1>
          <p className="text-sm text-gray-600 mt-1">Official Invoice</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">Invoice #: {transactionId}</p>
          <p className="text-xs text-gray-500 mt-1">
            Date: {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </header>

      {/* Billing + Summary */}
      <section className="grid grid-cols-2 gap-6 py-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base">Billing Details</h3>
          <div className="space-y-1 text-gray-700">
            <p><span className="font-semibold">Name:</span> {buyer?.name}</p>
            <p><span className="font-semibold">Phone:</span> {buyerphone}</p>
            <p><span className="font-semibold">Address:</span> {buyeraddress}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base">Order Summary</h3>
          <div className="space-y-1 text-gray-700">
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              <span
                className={`font-semibold ${
                  paymentStatus === "Paid"
                    ? "text-green-600"
                    : paymentStatus === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {paymentStatus}
              </span>
            </p>

            <p>
              <span className="font-semibold">Order Status:</span>{" "}
              <span className="font-semibold text-blue-700">{status}</span>
            </p>

            <p className="font-semibold text-lg mt-3">
              Total: Rs. {Number(totalAmount).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Product Table */}
      <section>
     <table className="w-full border-collapse text-sm table-auto">
<thead>
<tr className="border-b-2 border-gray-300 bg-gray-100">
<th className="text-left py-2 px-2 font-semibold text-gray-800 w-1/2">Product</th>
<th className="text-center py-2 px-2 ml-5 pl-5  font-semibold text-gray-800 w-1/4">Quantity</th>
<th className="text-right py-2 px-2 font-semibold text-gray-800 w-1/4">Price</th>
</tr>
</thead>


<tbody>
{products.map((p) => (
<tr key={p._id} className="border-b border-gray-200 align-top">
<td className="py-3 px-2 text-gray-800 font-medium whitespace-normal break-words">{p.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
<td className="py-3 px-2 font-bold text-center ml-5 pl-5 text-gray-700">{p.quantity}</td>
<td className="py-3 px-2 text-right font-semibold text-gray-900">Rs. {p.price}</td>
</tr>
))}
</tbody>
</table>

        {/* Totals */}
        <div className="mt-8 w-full flex justify-end">
          <div className="w-1/3 text-sm">
            <div className="flex justify-between py-1 text-gray-700">
              <span>Subtotal</span>
              <span>Rs. {Number(totalAmount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-t border-gray-300 pt-3 font-semibold text-gray-900 text-base">
              <span>Total</span>
              <span>Rs. {Number(totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-xs text-gray-500 text-center border-t pt-4 space-y-1">
        <p>Thank you for shopping with Taskeena.</p>
        <p>If you have any questions about this invoice, please contact us:</p>
        <p><span className="font-semibold">Phone:</span> 03256795256</p>
        <p><span className="font-semibold">Email:</span> taskeenaonline@gmail.com</p>
      </footer>
    </div>
  );
});

export default PrintableInvoice;
