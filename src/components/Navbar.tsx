"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          <Link href="/" className="text-xl font-bold">
            Salon Manager
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/services">
            <Button variant="ghost">Services</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact</Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button>Admin Dashboard</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
} 