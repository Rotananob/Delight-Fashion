import React from "react";
import { getAdminOrderByIdAction } from "@/app/actions/adminOrderActions";
import { Crown } from "lucide-react";
import Link from "next/link";
import { OrderItem } from "@/types";

export const metadata = {
  title: "Print Invoice | Delight Fashion",
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const res = await getAdminOrderByIdAction(id);
  
  if (!res.success || !res.order) {
    return <div className="p-8 text-black bg-white">Order not found.</div>;
  }

  const order = res.order;
  const orderCode = (order as any).orderCode || order.id.substring(order.id.length - 6).toUpperCase();

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Non-printable back button */}
      <div className="print:hidden p-4 bg-gray-100 border-b flex justify-between items-center">
        <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline text-sm font-semibold">
          &larr; Back to Order
        </Link>
        <button 
          className="bg-black text-white px-4 py-2 rounded-sm text-sm font-bold shadow-sm"
          onClick={() => {/* will be handled by a client component, but for SSR we just render a simple button or let user use Ctrl+P */}}
        >
          Print (Ctrl + P)
        </button>
      </div>

      {/* Printable Area - A4 Size constrained for viewing */}
      <div className="max-w-[800px] mx-auto bg-white p-10 print:p-0 print:m-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-black" />
              <span className="text-2xl font-bold tracking-[0.2em] uppercase">DELIGHT</span>
            </div>
            <p className="text-sm font-medium">Delight Fashion Phnom Penh</p>
            <p className="text-xs text-gray-500">123 Fashion Street, Chamkar Mon, Phnom Penh</p>
            <p className="text-xs text-gray-500">Tel: +855 12 345 678</p>
          </div>
          <div className="text-right flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-black">INVOICE</h1>
            <p className="text-sm font-bold mt-2">Order #: {orderCode}</p>
            <p className="text-xs text-gray-500">Date: {new Date(order.createdAt || "").toLocaleDateString("en-GB")}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Status: {order.status}</p>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-2">Billed To / Ship To</h2>
            <p className="font-bold text-sm">{order.shippingAddress?.fullName || (order as any).customerInfo?.fullName}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress?.addressLine1 || (order as any).customerInfo?.address}</p>
            <p className="text-sm text-gray-700">
              {order.shippingAddress?.district && `${order.shippingAddress.district}, `}
              {order.shippingAddress?.city || "Phnom Penh"}
            </p>
            <p className="text-sm text-gray-700 font-semibold mt-2">Tel: {order.shippingAddress?.phone || (order as any).customerInfo?.phone}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-2">Payment Details</h2>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Method:</span>
              <span className="font-bold">{order.paymentMethod === "ABA_QR" ? "ABA PayWay" : "Cash on Delivery"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="font-bold uppercase">{(order as any).paymentStatus || "Pending"}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left mb-10 border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest">Item Description</th>
              <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-center">Qty</th>
              <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-right">Unit Price</th>
              <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items.map((item: OrderItem, idx: number) => (
              <tr key={idx}>
                <td className="py-4 px-2">
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 uppercase mt-1">Size: {item.size} | Color: {item.color}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>
                </td>
                <td className="py-4 px-2 text-center text-sm font-semibold">{item.quantity}</td>
                <td className="py-4 px-2 text-right text-sm">${item.price.toFixed(2)}</td>
                <td className="py-4 px-2 text-right text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-64 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee:</span>
              <span>{order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-3 mt-1">
              <span>Grand Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-8 flex flex-col gap-2">
          <p className="text-sm font-bold tracking-widest uppercase">Thank you for your business!</p>
          <p className="text-xs text-gray-500">For any inquiries regarding this invoice, please contact us at support@delightfashion.com</p>
        </div>
        
      </div>
    </div>
  );
}
