"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  BarChart4, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function AdminNavbar() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Appointments",
      href: "/admin/appointments",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Inventory",
      href: "/admin/inventory",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Customers",
      href: "/admin/customers",
    },
    {
      icon: <BarChart4 className="h-5 w-5" />,
      label: "Reports",
      href: "/admin/reports",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-indigo-600">Salon Admin</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between px-4 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="space-y-4 pt-4">
          <div className="border-t border-gray-200 pt-4">
            <Button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center justify-start space-x-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              variant="ghost"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
          <div className="px-3 py-2">
            <div className="text-xs text-gray-500">
              Logged in as
            </div>
            <div className="text-sm font-medium">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
} 