"use client";

import React, { useState } from "react";
import { TimeSlot as TimeSlotType, Appointment } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  slot: TimeSlotType;
  appointments?: Appointment[];
  onBook?: (slotId: string) => void;
  isAdmin?: boolean;
}

export function TimeSlot({ slot, appointments = [], onBook, isAdmin = false }: TimeSlotProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const isAvailable = slot.currentBookings < slot.maxBookings;
  const percentageFilled = (slot.currentBookings / slot.maxBookings) * 100;
  
  const handleClick = () => {
    if (isAdmin || slot.isBooked) {
      setDialogOpen(true);
    } else if (isAvailable && onBook) {
      onBook(slot.id);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative flex h-16 w-full items-center justify-between rounded-md border p-3 transition-colors",
          slot.isBooked 
            ? "cursor-pointer border-indigo-200 bg-indigo-50" 
            : isAvailable 
              ? "cursor-pointer border-slate-200 bg-white hover:border-indigo-300" 
              : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
        )}
        onClick={handleClick}
      >
        <div className="flex flex-col">
          <span className="font-medium">{slot.time}</span>
          <span className="text-xs text-slate-500">
            {slot.currentBookings} / {slot.maxBookings} booked
          </span>
        </div>
        
        {slot.isBooked && (
          <div className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
            {isAdmin ? "View Details" : "Booked"}
          </div>
        )}
        
        {/* Booking progress indicator */}
        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500" style={{ width: `${percentageFilled}%` }} />
      </div>
      
      {/* Detail Dialog */}
      <Dialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        title={`${slot.time} - Appointment Details`}
      >
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-md border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{appointment.userName}</h4>
                  <span className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    appointment.status === "confirmed" ? "bg-green-100 text-green-800" : 
                    appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    appointment.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  )}>
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <p>Service: {appointment.service}</p>
                  <p>Phone: {appointment.phoneNumber}</p>
                  <p>Booked on: {appointment.createdAt}</p>
                </div>
                
                {isAdmin && (
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button className="bg-white text-slate-800 border border-slate-300 hover:bg-slate-50">
                      Edit
                    </Button>
                    <Button className="bg-red-600 text-white hover:bg-red-700">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500">No appointments for this time slot.</p>
          )}
        </div>
      </Dialog>
    </>
  );
} 