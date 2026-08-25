import React from "react";
import { getAdminOrdersAction } from "@/app/actions/adminOrderActions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Eye, Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types";

export const metadata = {
  title: "Order Management | Delight Fashion Admin",
};

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Pending": return <Badge variant="outline" size="sm" className="gap-1"><Clock className="w-3 h-3"/>Pending</Badge>;
    case "Confirmed": return <Badge variant="gold" size="sm" className="gap-1"><Package className="w-3 h-3"/>Confirmed</Badge>;
    case "Shipping": return <Badge variant="dark" size="sm" className="gap-1"><Truck className="w-3 h-3"/>Shipping</Badge>;
    case "Completed": return <Badge variant="success" size="sm" className="gap-1"><CheckCircle2 className="w-3 h-3"/>Completed</Badge>;
    case "Cancelled": return <Badge variant="danger" size="sm" className="gap-1"><XCircle className="w-3 h-3"/>Cancelled</Badge>;
    default: return <Badge variant="dark" size="sm">{status}</Badge>;
  }
};

export default async function AdminOrdersPage() {
  const res = await getAdminOrdersAction();
  
  if (!res.success) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-rose-500">Failed to load orders</h1>
        <p className="text-white/60">{res.error}</p>
      </div>
    );
  }

  const orders = res.orders || [];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
          <Package className="w-6 h-6 text-[#D4AF37]" />
          Order Management
        </h1>
        <div className="flex gap-2">
          {/* We can add filter buttons here in the future */}
          <div className="px-4 py-2 bg-[#111] border border-white/10 text-xs font-semibold text-white/60 rounded-sm">
            Total: {orders.length} Orders
          </div>
        </div>
      </div>

      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#171717] border-b border-white/10 text-white/50 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-[#D4AF37] hover:underline">
                        #{(order as any).orderCode || order.id.substring(order.id.length - 6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {new Date(order.createdAt || "").toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{order.shippingAddress?.fullName || order.customerEmail}</span>
                        <span className="text-xs text-white/50">{order.shippingAddress?.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-sm bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
