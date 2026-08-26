"use client";

import React, { useState } from "react";
import { OrderStatus } from "@/types";
import { updateOrderStatusAction } from "@/app/actions/adminOrderActions";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const OrderStatusUpdater: React.FC<{ orderId: string; currentStatus: OrderStatus }> = ({
  orderId,
  currentStatus,
}) => {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    try {
      const res = await updateOrderStatusAction(orderId, status);
      if (res.success) {
        router.refresh();
      } else {
        alert("Failed to update status: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-border rounded-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
        Update Order Status
      </h3>
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="flex-1 bg-[#1A1A1A] border border-white/20 focus:border-[#D4AF37] outline-none rounded-sm px-3.5 py-2.5 text-sm text-foreground transition-colors"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipping">Shipping</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <Button
          variant="gold"
          size="sm"
          onClick={handleUpdate}
          isLoading={isUpdating}
          disabled={status === currentStatus}
          className="h-[42px]"
        >
          Update
        </Button>
      </div>
    </div>
  );
};
