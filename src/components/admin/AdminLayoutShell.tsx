"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export interface AdminLayoutShellProps {
  children: React.ReactNode;
  unreadOrderCount?: number;
}

export const AdminLayoutShell: React.FC<AdminLayoutShellProps> = ({
  children,
  unreadOrderCount = 0,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar (Desktop + Mobile Modal) */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          unreadOrderCount={unreadOrderCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
