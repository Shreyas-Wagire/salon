"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: string;
  isBooked: boolean;
  maxBookings: number;
  currentBookings: number;
  customerName?: string;
  onBook?: () => void;
  onViewDetails?: () => void;
}

export function TimeSlot({
  time,
  isBooked,
  maxBookings,
  currentBookings,
  customerName,
  onBook,
  onViewDetails
}: TimeSlotProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    if (isBooked) {
      setShowDetails(true);
    } else if (currentBookings < maxBookings && onBook) {
      onBook();
    }
  };

  const percentageFilled = (currentBookings / maxBookings) * 100;

  return (
    <>
      <div
        className={cn(
          "relative flex h-16 items-center justify-between rounded-md border p-3 transition-colors",
          isBooked
            ? "cursor-pointer border-indigo-200 bg-indigo-50"
            : currentBookings < maxBookings
            ? "cursor-pointer border-slate-200 bg-white hover:border-indigo-300"
            : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
        )}
        onClick={handleClick}
      >
        <div className="flex flex-col">
          <span className="font-medium">{time}</span>
          <span className="text-xs text-slate-500">
            {currentBookings}/{maxBookings} booked
          </span>
        </div>

        {isBooked && customerName && (
          <div className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
            {customerName}
          </div>
        )}

        {/* Booking progress indicator */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-indigo-500"
          style={{ width: `${percentageFilled}%` }}
        />
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Slot Details - {time}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Customer:</p>
              <p>{customerName}</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <p>Booked ({currentBookings}/{maxBookings} slots taken)</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}