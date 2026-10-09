import React from "react";
import { adminDb } from "@/services/firebase/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, User, ShieldCheck, Mail, Calendar } from "lucide-react";

export default async function AdminCustomersPage() {
  let customers: any[] = [];
  try {
    const snap = await adminDb.collection("users").get();
    customers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
            Customer Directory
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            Registered patrons and showroom accounts for Delight Fashion.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-sm">
          <Users className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            {customers.length} Accounts
          </span>
        </div>
      </div>

      {/* Customers Table */}
      <Card variant="bordered" className="overflow-x-auto bg-white">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-foreground/60 text-xs uppercase tracking-widest border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-foreground/40">
                  No customers registered yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 border border-border flex items-center justify-center font-bold text-xs text-foreground uppercase">
                        {c.displayName ? c.displayName.charAt(0) : "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {c.displayName || "Shopper"}
                        </span>
                        <span className="text-[11px] text-foreground/40 font-mono">
                          UID: {c.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-foreground/40" />
                      <span>{c.email || "No email"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37]/40">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Customer
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-foreground/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-foreground/40" />
                      <span>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
