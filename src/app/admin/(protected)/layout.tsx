import React from "react";
import { redirect } from "next/navigation";
import { getSessionServer } from "@/app/actions/authActions";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { generateSeoMetadata } from "@/utils/seo";

export const metadata = generateSeoMetadata({
  title: "Shop Owner Admin | Delight Fashion",
  description: "Secure admin dashboard for managing Delight Fashion catalog and orders.",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("mock");

  // Only perform strict server-side Firebase verification if NOT in Mock Mode
  if (!isMockMode) {
    const session = await getSessionServer();
    if (!session) {
      redirect("/admin/login");
    }

    // Check custom claims for Admin Role
    if (session.admin !== true) {
      // User is logged in, but NOT an admin. Redirect to storefront.
      redirect("/");
    }
  }

  // Simulated unread telegram/order count for the Admin Header
  const unreadOrderCount = 2;

  return (
    <AdminLayoutShell unreadOrderCount={unreadOrderCount}>
      {children}
    </AdminLayoutShell>
  );
}
