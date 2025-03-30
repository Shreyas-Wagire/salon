"use client";

import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  
  return (
    <AdminDashboardContent userId={session?.user.id} />
  );
} 