"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientFeedbackContent } from "@/components/client/ClientFeedbackContent";
import { useAuth } from "@/components/AuthProvider";
import { hasRole } from "@/lib/auth";

export default function FeedbackPage() {
  const { authState } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authState.loading && !authState.isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/client/feedback');
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
    <ClientFeedbackContent 
      userId={authState.user?.id || ''} 
      userName={authState.user?.name || authState.user?.email || ''} 
    />
  );
} 