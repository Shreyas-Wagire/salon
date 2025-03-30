import { DefaultSession } from "next-auth";

// Extend NextAuth user types
declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    phoneNumber?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      phoneNumber?: string;
    } & DefaultSession["user"];
  }
}

// Extend JWT token types
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

// Time Slot Types
export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  maxBookings: number;
  currentBookings: number;
}

// Appointment Types
export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

// Business Hours
export interface BusinessHours {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  openTime: string; // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
  isOpen: boolean;
}

// Payment Types
export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: "cash" | "card" | "other";
  status: "pending" | "completed" | "failed";
  date: string;
}

// Feedback Types
export interface Feedback {
  id: string;
  appointmentId: string;
  clientId: string;
  rating: number;
  comment?: string;
  date: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  idealQuantity: number;
  price: number;
  lowStockAlert: number;
  supplier?: string;
  lastRestocked: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "client";
  phone?: string;
  address?: string;
} 