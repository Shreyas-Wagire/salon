"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 max-w-7xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Scissors className="h-6 w-6 text-primary" />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Salon Manager</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
            <Link href="/services">
              <Button variant="ghost" className="text-sm font-medium">
                Services
              </Button>
            </Link>
            <Link href="/inventory">
              <Button variant="ghost" className="text-sm font-medium">
                Products
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-sm font-medium">
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-sm font-medium">
                Contact
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="default" className="text-sm font-medium">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 