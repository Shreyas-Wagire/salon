"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

export default function UnauthorizedPage() {
  const { logout } = useAuth();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 text-9xl">🔒</div>
          <p className="mb-4">
            You don't have permission to access this page. This area requires administrator privileges.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={async () => {
              await logout();
              window.location.href = "/auth/signin";
            }}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 