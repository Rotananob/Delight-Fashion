import React from "react";
import { getCustomerOrdersAction } from "@/app/actions/customerOrderActions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Order, OrderStatus, OrderStatusHistoryItem } from "@/types";
import { Package, Clock, Truck, CheckCircle2, XCircle, MapPin, Search } from "lucide-react";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";

export const metadata = {
  title: "My Orders | Delight Fashion",
};

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Pending": return <Badge variant="outline" size="sm" className="gap-1"><Clock className="w-3 h-3"/>Processing</Badge>;
    case "Confirmed": return <Badge variant="gold" size="sm" className="gap-1"><Package className="w-3 h-3"/>Confirmed</Badge>;
    case "Shipping": return <Badge variant="dark" size="sm" className="gap-1"><Truck className="w-3 h-3"/>In Transit</Badge>;
    case "Completed": return <Badge variant="success" size="sm" className="gap-1"><CheckCircle2 className="w-3 h-3"/>Delivered</Badge>;
    case "Cancelled": return <Badge variant="danger" size="sm" className="gap-1"><XCircle className="w-3 h-3"/>Cancelled</Badge>;
    default: return <Badge variant="dark" size="sm">{status}</Badge>;
  }
};

export default async function CustomerOrdersPage() {
  const res = await getCustomerOrdersAction();
  
  if (!res.success) {
    return (
      <div className="min-h-screen bg-white flex flex-col text-black">
        <StorefrontHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-black mb-2">Track Your Order</h1>
          <p className="text-gray-500 max-w-md">
            {res.error === "Unauthorized: Please sign in" 
              ? "Please sign in to view your order history." 
              : "We could not load your orders at this time. Please try again later."}
          </p>
        </main>
        <StorefrontFooter />
      </div>
    );
  }

  const orders = res.orders || [];

  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      <StorefrontHeader />
      
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-border pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-black">
            Order History
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Track your luxury items from our Phnom Penh showroom to your door.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-border rounded-sm bg-gray-50">
            <Package className="w-12 h-12 text-black/20 mb-4" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-black">No Orders Yet</h2>
            <p className="text-sm text-gray-500 mt-2">Your fashion journey begins with your first purchase.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map((order: Order) => {
              const orderCode = (order as any).orderCode || order.id.substring(order.id.length - 6).toUpperCase();
              
              return (
                <Card key={order.id} variant="bordered" className="overflow-hidden bg-gray-50">
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 bg-white border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-black">
                        Order #{orderCode}
                      </span>
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                        Placed on {new Date(order.createdAt || "").toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Items Purchased
                      </h3>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-16 h-20 bg-gray-100 border border-border shrink-0">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-center flex-1">
                            <span className="font-bold text-sm text-black line-clamp-1">{item.title}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                              {item.size} • {item.color}
                            </span>
                            <span className="text-black font-semibold text-sm mt-1">
                              ${item.price.toFixed(2)} <span className="text-gray-500 font-normal text-xs">x {item.quantity}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary & Tracking */}
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3 p-4 bg-white border border-border rounded-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                          Delivery Address
                        </h3>
                        <div className="flex gap-3 text-xs text-gray-600 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                          <span>
                            <span className="font-bold text-black block mb-0.5">{order.shippingAddress.fullName}</span>
                            {order.shippingAddress.addressLine1}<br/>
                            {order.shippingAddress.district && `${order.shippingAddress.district}, `}
                            {order.shippingAddress.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery</span>
                          <span>{order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-black font-bold pt-2 border-t border-border mt-1">
                          <span>Total</span>
                          <span className="text-black">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-border">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
                        Tracking History
                      </h3>
                      <div className="flex flex-col gap-3">
                        {order.statusHistory.map((history: OrderStatusHistoryItem, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                            <div className="flex flex-col text-xs">
                              <span className="font-semibold text-black uppercase tracking-wider">{history.status}</span>
                              <span className="text-gray-500">
                                {new Date(history.timestamp).toLocaleString("en-GB", {
                                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                                })}
                              </span>
                            </div>
                          </div>
                        )).reverse()}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      <StorefrontFooter />
    </div>
  );
}
