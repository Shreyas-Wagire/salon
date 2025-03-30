import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Payment } from "@/types";

interface PaymentStore {
  // Payments data
  payments: Payment[];
  addPayment: (payment: Omit<Payment, "id" | "status">) => string;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  getPaymentsByUserId: (userId: string) => Payment[];
  getPaymentsByDate: (date: string) => Payment[];
  getPaymentsByDateRange: (startDate: string, endDate: string) => Payment[];
  getDailySalesTotal: (date: string) => number;
  getMonthlySalesTotal: (year: number, month: number) => number;
  getYearlySalesTotal: (year: number) => number;
  getPaymentsByAppointmentId: (appointmentId: string) => Payment[];
}

// Mock initial payments for demo purposes
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];

const initialPayments: Payment[] = [
  {
    id: uuid(),
    appointmentId: "appt-1",
    userId: "user-1",
    userName: "John Doe",
    amount: 45,
    date: today,
    paymentMethod: "card",
    service: "Haircut",
    status: "paid",
  },
  {
    id: uuid(),
    appointmentId: "appt-2",
    userId: "user-2",
    userName: "Jane Smith",
    amount: 90,
    date: today,
    paymentMethod: "cash",
    service: "Hair Coloring",
    status: "paid",
  },
  {
    id: uuid(),
    appointmentId: "appt-3",
    userId: "user-3",
    userName: "Bob Johnson",
    amount: 35,
    date: yesterday,
    paymentMethod: "online",
    service: "Manicure",
    status: "paid",
  },
  {
    id: uuid(),
    appointmentId: "appt-4",
    userId: "user-4",
    userName: "Alice Williams",
    amount: 70,
    date: yesterday,
    paymentMethod: "card",
    service: "Facial",
    status: "paid",
  },
  {
    id: uuid(),
    appointmentId: "appt-5",
    userId: "user-5",
    userName: "Charlie Brown",
    amount: 45,
    date: twoDaysAgo,
    paymentMethod: "cash",
    service: "Haircut",
    status: "paid",
  },
  {
    id: uuid(),
    appointmentId: "appt-6",
    userId: "user-1",
    userName: "John Doe",
    amount: 35,
    date: twoDaysAgo,
    paymentMethod: "online",
    service: "Manicure",
    status: "paid",
  }
];

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // Initialize payments
  payments: initialPayments,
  
  // Payment CRUD operations
  addPayment: (payment) => {
    const paymentId = uuid();
    const newPayment: Payment = {
      id: paymentId,
      ...payment,
      status: "paid",
    };
    
    set((state) => ({
      payments: [...state.payments, newPayment],
    }));
    
    return paymentId;
  },
  
  updatePayment: (paymentId, updates) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === paymentId ? { ...payment, ...updates } : payment
      ),
    }));
  },
  
  // Payment queries
  getPaymentsByUserId: (userId) => {
    return get().payments.filter(payment => payment.userId === userId);
  },
  
  getPaymentsByDate: (date) => {
    return get().payments.filter(payment => payment.date === date);
  },
  
  getPaymentsByDateRange: (startDate, endDate) => {
    return get().payments.filter(payment => {
      return payment.date >= startDate && payment.date <= endDate;
    });
  },
  
  getDailySalesTotal: (date) => {
    return get()
      .payments
      .filter(payment => payment.date === date && payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
  },
  
  getMonthlySalesTotal: (year, month) => {
    // Month is 0-indexed (0 = January, 11 = December)
    const datePrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    return get()
      .payments
      .filter(payment => 
        payment.date.startsWith(datePrefix) && 
        payment.status === "paid"
      )
      .reduce((total, payment) => total + payment.amount, 0);
  },
  
  getYearlySalesTotal: (year) => {
    const datePrefix = `${year}-`;
    
    return get()
      .payments
      .filter(payment => 
        payment.date.startsWith(datePrefix) && 
        payment.status === "paid"
      )
      .reduce((total, payment) => total + payment.amount, 0);
  },
  
  getPaymentsByAppointmentId: (appointmentId) => {
    return get().payments.filter(payment => payment.appointmentId === appointmentId);
  },
})); 