"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/features/auth/AuthContext";
import { PaymentMethod, Order } from "@/types";
import {
  CheckCircle2,
  QrCode,
  Truck,
  ShieldCheck,
  Send,
  Lock,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.displayName || "Sokha Vong");
  const [phone, setPhone] = useState(user?.phone || "012 345 678");
  const [email, setEmail] = useState(user?.email || "sokha.vong@gmail.com");
  const [addressLine1, setAddressLine1] = useState(
    user?.savedAddresses?.[0]?.addressLine1 || "St 271, Sangkat Tumnop Teuk"
  );
  const [district, setDistrict] = useState(
    user?.savedAddresses?.[0]?.district || "Chamkar Mon"
  );
  const [city, setCity] = useState("Phnom Penh");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ABA_QR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network validation and server action latency
    await new Promise((r) => setTimeout(r, 1000));

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || "guest_customer",
      customerEmail: email,
      shippingAddress: {
        id: "addr_checkout",
        fullName,
        phone,
        addressLine1,
        district,
        city,
      },
      items: [...items],
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      status: "Pending",
      statusHistory: [
        {
          status: "Pending",
          timestamp: new Date().toISOString(),
          note: `Order placed via ${paymentMethod}. Awaiting dispatch from Phnom Penh showroom.`,
        },
      ],
      telegramNotified: true,
      createdAt: new Date().toISOString(),
    };

    setConfirmedOrder(newOrder);
    setIsSubmitting(false);
    clearCart();
    onOrderSuccess(newOrder);
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={confirmedOrder ? "ORDER CONFIRMED" : "SECURE CAMBODIA CHECKOUT"}
      maxWidth="xl"
    >
      {confirmedOrder ? (
        /* Order Confirmed Luxury Success View */
        <div className="flex flex-col items-center text-center py-6 gap-5">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-[0.2em]">
              Thank You For Your Order
            </span>
            <h3 className="text-2xl font-bold uppercase tracking-wider text-white">
              Order #{confirmedOrder.id}
            </h3>
          </div>

          <p className="text-xs text-white/70 max-w-md leading-relaxed">
            Your luxury order has been received! Our Phnom Penh showroom team has been notified via Telegram and will dispatch your items shortly.
          </p>

          <div className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-sm p-4 text-left flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-white/60">
              <span>Customer:</span>
              <span className="text-white font-medium">
                {confirmedOrder.shippingAddress.fullName}
              </span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Phone (Cambodia):</span>
              <span className="text-white font-medium">
                {confirmedOrder.shippingAddress.phone}
              </span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Payment Mode:</span>
              <span className="text-[#D4AF37] font-semibold">
                {confirmedOrder.paymentMethod === "ABA_QR"
                  ? "ABA Bank PayWay QR"
                  : "Cash on Delivery (COD)"}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
              <span className="text-white">Total Amount:</span>
              <span className="text-[#D4AF37]">
                ${confirmedOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#229ED9]">
            <Send className="w-3.5 h-3.5" />
            <span>Telegram notification sent to @DelightFashionKH</span>
          </div>

          <Button
            variant="gold"
            size="lg"
            onClick={resetAndClose}
            className="w-full max-w-sm mt-2 font-bold"
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      ) : (
        /* Checkout Form View */
        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
          {/* Shipping Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] border-l-2 border-[#D4AF37] pl-2.5">
              1. Phnom Penh Delivery Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sokha Vong"
              />
              <Input
                label="Cambodia Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="012 345 678"
              />
            </div>

            <Input
              label="Email Address (For Receipt)"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sokha@example.com"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address / Building"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="St 271, Sangkat Tumnop Teuk"
                />
              </div>
              <Input
                label="District / Khan"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Chamkar Mon"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] border-l-2 border-[#D4AF37] pl-2.5">
              2. Select Payment Method
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("ABA_QR")}
                className={twMerge(
                  "p-4 rounded-sm border flex flex-col items-center gap-2 text-center transition-all",
                  paymentMethod === "ABA_QR"
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[#111111] border-white/10 text-white/60 hover:border-white/30"
                )}
              >
                <QrCode
                  className={twMerge(
                    "w-6 h-6",
                    paymentMethod === "ABA_QR"
                      ? "text-[#D4AF37]"
                      : "text-white/40"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    ABA PayWay QR
                  </span>
                  <span className="text-[10px] text-white/50">
                    Instant Bank Transfer
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={twMerge(
                  "p-4 rounded-sm border flex flex-col items-center gap-2 text-center transition-all",
                  paymentMethod === "COD"
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[#111111] border-white/10 text-white/60 hover:border-white/30"
                )}
              >
                <Truck
                  className={twMerge(
                    "w-6 h-6",
                    paymentMethod === "COD"
                      ? "text-[#D4AF37]"
                      : "text-white/40"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] text-white/50">
                    Pay When Order Arrives
                  </span>
                </div>
              </button>
            </div>

            {/* ABA QR Account Instructions */}
            {paymentMethod === "ABA_QR" && (
              <div className="p-3.5 rounded-sm bg-[#171717] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold">
                    ABA Bank Cambodia Account:
                  </span>
                  <span className="text-[#D4AF37] font-mono font-bold">
                    001 234 567 (DELIGHT FASHION CO., LTD)
                  </span>
                  <span className="text-[11px] text-white/50">
                    Please scan QR or transfer and show reference upon delivery.
                  </span>
                </div>
                <div className="w-12 h-12 rounded-sm bg-white p-1 shrink-0">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Submit */}
          <div className="p-4 rounded-sm bg-[#111111] border border-white/10 flex flex-col gap-3">
            <div className="flex justify-between text-xs text-white/70">
              <span>Subtotal ({items.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>Cambodia Delivery</span>
              <span className="text-[#D4AF37]">
                {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-white/10 pt-2">
              <span>TOTAL TO PAY</span>
              <span className="text-lg text-[#D4AF37]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Lock className="w-4 h-4" />}
              className="w-full mt-2 font-bold shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              COMPLETE ORDER (${totalAmount.toFixed(2)})
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                100% Encrypted &amp; Protected by Delight Fashion Security
              </span>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
