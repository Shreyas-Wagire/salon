"use client";

import React from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  
  // Check if the user is authenticated and has admin role
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (status === "unauthenticated" || session?.user.role !== "admin") {
    redirect("/");
  }
  
  return (
    <div className="flex h-screen">
      <AdminNavbar />
      <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
    </div>
  );
} 