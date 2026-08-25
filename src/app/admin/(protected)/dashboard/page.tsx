import React from "react";
import { Card } from "@/components/ui/Card";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
          Shop Owner Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Welcome back to Delight Fashion HQ. Here&apos;s today&apos;s overview for Phnom Penh.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Today&apos;s Sales
            </span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">$450.00</span>
            <span className="text-xs font-medium text-emerald-400">+12%</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              New Orders (COD/ABA)
            </span>
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">8</span>
            <span className="text-xs font-medium text-emerald-400">+2</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Active Customers
            </span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">124</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Conversion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">3.2%</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="bordered" className="p-6 min-h-[300px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
            Recent Orders
          </h2>
          <div className="flex items-center justify-center h-40 text-sm text-white/40">
            Mock Mode: Connect Firebase to view real orders
          </div>
        </Card>
        <Card variant="bordered" className="p-6 min-h-[300px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
            Low Stock Alerts
          </h2>
          <div className="flex items-center justify-center h-40 text-sm text-white/40">
            All luxury stock items are adequately replenished
          </div>
        </Card>
      </div>
    </div>
  );
}
