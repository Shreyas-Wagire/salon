"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/components/TimeSlot";
import { useAppointmentStore } from "@/store/appointmentStore";

export default function AdminAppointmentsPage() {
  const { 
    businessHours,
    timeSlots,
    generateTimeSlots,
    updateBusinessHours
  } = useAppointmentStore();

  useEffect(() => {
    generateTimeSlots();
  }, [generateTimeSlots]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-slate-500">Manage appointments and time slots</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Opening Time</label>
              <input
                type="time"
                value={businessHours.start}
                onChange={(e) => updateBusinessHours(e.target.value, businessHours.end, businessHours.maxBookingsPerSlot)}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Closing Time</label>
              <input
                type="time"
                value={businessHours.end}
                onChange={(e) => updateBusinessHours(businessHours.start, e.target.value, businessHours.maxBookingsPerSlot)}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Bookings per Slot</label>
              <input
                type="number"
                min="1"
                value={businessHours.maxBookingsPerSlot}
                onChange={(e) => updateBusinessHours(businessHours.start, businessHours.end, parseInt(e.target.value))}
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.id}
            time={slot.time}
            isBooked={slot.isBooked}
            maxBookings={slot.maxBookings}
            currentBookings={slot.currentBookings}
            customerName={slot.customerName}
          />
        ))}
      </div>
    </div>
  );
}