"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/store/appointmentStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useFeedbackStore } from "@/store/feedbackStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { TimeSlot } from "@/components/TimeSlot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdminDashboardContentProps {
  userId?: string;
}

export function AdminDashboardContent({ userId = "" }: AdminDashboardContentProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [editingHours, setEditingHours] = useState(false);
  
  // Get data from stores
  const { 
    appointments, 
    timeSlots, 
    businessHours, 
    generateTimeSlots, 
    updateBusinessHour 
  } = useAppointmentStore();
  const { payments, getDailySalesTotal } = usePaymentStore();
  const { feedbacks, getAverageRating } = useFeedbackStore();
  const { items: inventoryItems, getLowStockItems } = useInventoryStore();
  
  // Generate time slots for selected date
  useEffect(() => {
    generateTimeSlots(selectedDate);
  }, [selectedDate, generateTimeSlots]);
  
  // Filter by selected date
  const todayAppointments = appointments.filter(app => app.date === selectedDate);
  const todayPayments = payments.filter(payment => payment.date === selectedDate);
  const dailySalesTotal = getDailySalesTotal(selectedDate);
  
  // Calculate stats
  const totalAppointments = todayAppointments.length;
  const confirmedAppointments = todayAppointments.filter(app => app.status === "confirmed").length;
  const pendingAppointments = todayAppointments.filter(app => app.status === "pending").length;
  const averageRating = getAverageRating();
  const lowStockItems = getLowStockItems();
  
  // Chart data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  }).reverse();
  
  const salesData = last7Days.map(date => ({
    date: format(new Date(date), "MMM dd"),
    sales: getDailySalesTotal(date),
  }));
  
  // Business hours by day of week
  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];
  
  // Temp state for business hours editing
  const [tempBusinessHours, setTempBusinessHours] = useState(businessHours);
  
  // Filter slots for today
  const todaySlots = timeSlots.filter(slot => slot.date === selectedDate);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };
  
  // Handle business hours update
  const handleBusinessHoursUpdate = () => {
    try {
      // Update each business hour
      tempBusinessHours.forEach(hour => {
        updateBusinessHour(hour.dayOfWeek, hour);
      });
      
      // Regenerate time slots for selected date
      generateTimeSlots(selectedDate);
      
      // Show success toast
      toast({
        title: "Business Hours Updated",
        description: "The new business hours have been saved successfully.",
      });
      
      // Exit editing mode
      setEditingHours(false);
    } catch (error) {
      toast({
        title: "Error Updating Hours",
        description: "There was an error updating the business hours.",
        variant: "destructive",
      });
    }
  };
  
  // Handle business hour change
  const handleBusinessHourChange = (
    dayOfWeek: number,
    field: "openTime" | "closeTime" | "isOpen",
    value: string | boolean
  ) => {
    setTempBusinessHours(prev =>
      prev.map(hour =>
        hour.dayOfWeek === dayOfWeek
          ? { ...hour, [field]: value }
          : hour
      )
    );
  };
  
  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <Button onClick={setToday} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Today
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Appointments</CardDescription>
            <CardTitle className="text-2xl">{totalAppointments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              {confirmedAppointments} confirmed, {pendingAppointments} pending
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Sales</CardDescription>
            <CardTitle className="text-2xl">${dailySalesTotal.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              From {todayPayments.length} transactions
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Booked Slots</CardDescription>
            <CardTitle className="text-2xl">
              {todaySlots.filter(slot => slot.isBooked).length}/{todaySlots.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              {todaySlots.length > 0 
                ? Math.round((todaySlots.filter(slot => slot.isBooked).length / todaySlots.length) * 100)
                : 0}% booked
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customer Rating</CardDescription>
            <CardTitle className="text-2xl">{averageRating.toFixed(1)}/5</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              From {feedbacks.length} reviews
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Chart & Business Hours */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Business Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Business Hours</CardTitle>
            {!editingHours ? (
              <Button 
                onClick={() => setEditingHours(true)}
                variant="outline"
                size="sm"
              >
                Edit Hours
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setEditingHours(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBusinessHoursUpdate}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editingHours ? tempBusinessHours : businessHours).map((hour) => (
                <div key={hour.dayOfWeek} className="grid grid-cols-3 items-center gap-2">
                  <Label className="font-medium">
                    {daysOfWeek.find(day => day.value === hour.dayOfWeek)?.label}
                  </Label>
                  {editingHours ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hour.isOpen}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              hour.dayOfWeek,
                              "isOpen",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label className="text-sm">Open</Label>
                      </div>
                      {hour.isOpen ? (
                        <div className="flex gap-1">
                          <Input
                            type="time"
                            value={hour.openTime}
                            onChange={(e) =>
                              handleBusinessHourChange(
                                hour.dayOfWeek,
                                "openTime",
                                e.target.value
                              )
                            }
                            className="w-24"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            type="time"
                            value={hour.closeTime}
                            onChange={(e) =>
                              handleBusinessHourChange(
                                hour.dayOfWeek,
                                "closeTime",
                                e.target.value
                              )
                            }
                            className="w-24"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500">Closed</span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className={hour.isOpen ? "text-green-600" : "text-red-600"}>
                        {hour.isOpen ? "Open" : "Closed"}
                      </div>
                      {hour.isOpen ? (
                        <div className="text-sm">{hour.openTime} - {hour.closeTime}</div>
                      ) : (
                        <div className="text-sm">-</div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Appointments & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {todayAppointments.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No appointments for today
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">{appointment.userName}</p>
                              <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
                              <p className={`text-sm ${
                                appointment.status === "confirmed" 
                                  ? "text-green-600" 
                                  : appointment.status === "pending" 
                                    ? "text-amber-600" 
                                    : "text-red-600"
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="confirmed" className="mt-4">
                {todayAppointments.filter(app => app.status === "confirmed").length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No confirmed appointments for today
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments
                      .filter(app => app.status === "confirmed")
                      .map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">{appointment.userName}</p>
                                <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
                                <p className="text-sm text-green-600">Confirmed</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                {todayAppointments.filter(app => app.status === "pending").length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No pending appointments for today
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments
                      .filter(app => app.status === "pending")
                      .map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">{appointment.userName}</p>
                                <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
                                <p className="text-sm text-amber-600">Pending</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Alerts & Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium">Low Stock Items</h3>
              {lowStockItems.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No low stock items
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {item.currentQuantity}/{item.idealQuantity}
                        </p>
                        <p className="text-xs text-gray-500">Reorder soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Customer</th>
                  <th className="pb-2 text-left font-medium">Service</th>
                  <th className="pb-2 text-left font-medium">Amount</th>
                  <th className="pb-2 text-left font-medium">Method</th>
                  <th className="pb-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayPayments.slice(0, 5).map(payment => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-2">{payment.userName}</td>
                    <td className="py-2">{payment.service}</td>
                    <td className="py-2">${payment.amount.toFixed(2)}</td>
                    <td className="py-2 capitalize">{payment.paymentMethod}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        payment.status === "paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {todayPayments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No payments for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 