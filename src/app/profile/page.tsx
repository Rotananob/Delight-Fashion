import React from "react";
import { getUserProfileAction } from "@/app/actions/userActions";
import { ProfileManagerClient } from "@/components/storefront/ProfileManagerClient";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";

export const metadata = {
  title: "My Profile | Delight Fashion",
};

export default async function ProfilePage() {
  const res = await getUserProfileAction();

  if (!res.success || !res.profile) {
    // If not authenticated or profile not found, redirect to home
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StorefrontHeader />
      
      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-black mb-10 text-center md:text-left">
            My <span className="text-gray-500">Account</span>
          </h1>
          
          <ProfileManagerClient initialProfile={res.profile} />
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
