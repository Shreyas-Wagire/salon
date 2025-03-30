"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientBookingContent } from "@/components/client/ClientBookingContent";
import { useAuth } from "@/components/AuthProvider";
import { hasRole } from "@/lib/auth";

export default function BookingPage() {
  const { authState } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated and has client role
    if (!authState.loading && !authState.isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/client/book');
    }
  }, [authState, router]);
  
  // Show loading or content based on authentication state
  if (authState.loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }
  
  if (!authState.isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <ClientBookingContent 
      userId={authState.user?.id || ''} 
      userName={authState.user?.name || authState.user?.email || ''} 
    />
  );
} 