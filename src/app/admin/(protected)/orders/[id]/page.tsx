import React from "react";
import { getAdminOrderByIdAction } from "@/app/actions/adminOrderActions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import Link from "next/link";
import { ArrowLeft, Printer, MapPin, Phone, Mail, PackageOpen } from "lucide-react";
import { OrderStatusHistoryItem } from "@/types";

export const metadata = {
  title: "Order Details | Delight Fashion Admin",
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const res = await getAdminOrderByIdAction(id);
  
  if (!res.success || !res.order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-rose-500">Order Not Found</h1>
        <Link href="/admin/orders" className="text-[#D4AF37] hover:underline mt-4 inline-block">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const order = res.order;
  const orderCode = (order as any).orderCode || order.id.substring(order.id.length - 6).toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 bg-[#111] hover:bg-white/5 border border-white/10 rounded-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
            Order <span className="text-[#D4AF37]">#{orderCode}</span>
          </h1>
        </div>
        <Link 
          href={`/admin/orders/${order.id}/invoice`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-sm font-semibold transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order Items & Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card variant="bordered" className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <PackageOpen className="w-4 h-4" /> Ordered Items
            </h2>
            
            <div className="flex flex-col gap-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center p-3 bg-[#111] border border-white/5 rounded-sm">
                  <div className="w-16 h-20 bg-[#1A1A1A] shrink-0 border border-white/10">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className="text-xs text-white/50 uppercase tracking-widest">{item.size} | {item.color}</span>
                    <span className="text-[10px] text-white/30 font-mono">SKU: {item.sku}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-bold text-[#D4AF37]">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-white/50">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white mt-2 pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#D4AF37]">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
              Status History Timeline
            </h2>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute top-2 bottom-2 left-[11px] w-[2px] bg-white/10 z-0"></div>
              {order.statusHistory?.map((history: OrderStatusHistoryItem, idx: number) => (
                <div key={idx} className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#171717] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{history.status}</span>
                    <span className="text-xs text-white/40">
                      {new Date(history.timestamp).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                    {history.note && <p className="text-xs text-white/60 mt-1 italic">"{history.note}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Customer & Status */}
        <div className="flex flex-col gap-6">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          <Card variant="bordered" className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
              Customer Details
            </h2>
            <div className="flex flex-col gap-4 text-sm text-white/80">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-white/40 tracking-widest">Name</span>
                <span className="font-semibold">{order.shippingAddress?.fullName || (order as any).customerInfo?.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/40" />
                <span>{order.customerEmail || "No Email"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>{order.shippingAddress?.phone || (order as any).customerInfo?.phone}</span>
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
              Shipping Address
            </h2>
            <div className="flex items-start gap-3 text-sm text-white/80 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
              <span>
                {order.shippingAddress?.addressLine1 || (order as any).customerInfo?.address}<br/>
                {order.shippingAddress?.district && `${order.shippingAddress.district}, `}
                {order.shippingAddress?.city || "Phnom Penh"}<br/>
                Cambodia
              </span>
            </div>
          </Card>

          <Card variant="bordered" className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
              Payment Information
            </h2>
            <div className="flex flex-col gap-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span className="text-white/40">Method</span>
                <span className="font-bold">{order.paymentMethod === "ABA_QR" ? "ABA PayWay" : "Cash on Delivery"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Status</span>
                {(order as any).paymentStatus === "unpaid" ? (
                  <Badge variant="outline" size="sm">Unpaid</Badge>
                ) : (
                  <Badge variant="gold" size="sm">{(order as any).paymentStatus || "Pending Verification"}</Badge>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
