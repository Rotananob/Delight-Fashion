"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { getAdminDashboardStatsAction } from "@/app/actions/adminOrderActions";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    todaySales: 0,
    newOrders: 0,
    activeUsers: 0,
  });
  
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const res = await getAdminDashboardStatsAction();
        if (res.success && res.stats) {
          setStats(res.stats);
          setSalesData(res.salesData || []);
          setRecentOrders(res.recentOrders || []);
          setLowStock(res.lowStock || []);
        } else {
          console.warn("Could not fetch dashboard stats from server action:", res.error);
          setSalesData([
            { name: format(subDays(new Date(), 6), "MMM dd"), sales: 0 },
            { name: format(subDays(new Date(), 5), "MMM dd"), sales: 0 },
            { name: format(subDays(new Date(), 4), "MMM dd"), sales: 0 },
            { name: format(subDays(new Date(), 3), "MMM dd"), sales: 0 },
            { name: format(subDays(new Date(), 2), "MMM dd"), sales: 0 },
            { name: format(subDays(new Date(), 1), "MMM dd"), sales: 0 },
            { name: format(new Date(), "MMM dd"), sales: 0 },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setSalesData([
          { name: format(subDays(new Date(), 6), "MMM dd"), sales: 0 },
          { name: format(subDays(new Date(), 5), "MMM dd"), sales: 0 },
          { name: format(subDays(new Date(), 4), "MMM dd"), sales: 0 },
          { name: format(subDays(new Date(), 3), "MMM dd"), sales: 0 },
          { name: format(subDays(new Date(), 2), "MMM dd"), sales: 0 },
          { name: format(subDays(new Date(), 1), "MMM dd"), sales: 0 },
          { name: format(new Date(), "MMM dd"), sales: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
          Shop Owner Dashboard
        </h1>
        <p className="text-sm text-foreground/50 mt-1">
          Welcome back to Delight Fashion HQ. Here's today's overview.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Today's Sales
            </span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">${stats.todaySales.toFixed(2)}</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              New Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{stats.newOrders}</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Active Customers
            </span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{stats.activeUsers}</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Conversion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">3.2%</span>
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card variant="bordered" className="p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-6">
          Sales Overview (Last 7 Days)
        </h2>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-foreground/40">Loading Chart...</div>
          ) : salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#0a0a0a' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#D4AF37', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-foreground/40">No sales data found</div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="bordered" className="p-6 min-h-[300px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
            Recent Orders
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-sm text-foreground/40">Loading...</div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Order #{order.orderCode || order.id?.slice(0, 8)}
                    </p>
                    <p className="text-xs text-foreground/60">{order.customerName || order.customerEmail || "Guest Customer"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#D4AF37]">
                      ${(Number(order.totalAmount || order.total) || 0).toFixed(2)}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 text-foreground/80 font-medium rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-foreground/40">
              No recent orders found.
            </div>
          )}
        </Card>
        
        <Card variant="bordered" className="p-6 min-h-[300px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
            Low Stock Alerts
          </h2>
          {isLoading ? (
             <div className="flex items-center justify-center h-40 text-sm text-foreground/40">Loading...</div>
          ) : lowStock.length > 0 ? (
             <div className="space-y-4">
              {lowStock.map(product => (
                <div key={product.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm line-clamp-1">{product.title}</p>
                      <p className="text-xs text-foreground/60">Category: {product.categoryId || "General"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-rose-500">
                      {product.totalStock !== undefined ? product.totalStock : (product.stock ?? 0)} left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-foreground/40">
              All luxury stock items are adequately replenished.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
