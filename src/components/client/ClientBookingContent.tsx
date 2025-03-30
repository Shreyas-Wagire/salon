"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAppointmentStore } from "@/store/appointmentStore";
import { usePaymentStore } from "@/store/paymentStore";
import { format, addDays } from "date-fns";

interface ClientBookingContentProps {
  userId: string;
  userName: string;
}

export function ClientBookingContent({ userId, userName }: ClientBookingContentProps) {
  const { toast } = useToast();
  const { 
    services, 
    timeSlots, 
    generateTimeSlots, 
    getAvailableSlots,
    addAppointment 
  } = useAppointmentStore();
  const { addPayment } = usePaymentStore();
  
  // State for booking form
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, "yyyy-MM-dd"),
      label: format(date, "EEEE, MMMM d, yyyy"),
    };
  });

  // Generate time slots when date or service changes
  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots(selectedDate);
    }
  }, [selectedDate, generateTimeSlots]);

  // Update available slots when date or service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const slots = getAvailableSlots(selectedDate, selectedService);
      setAvailableSlots(slots);
      setSelectedSlot(""); // Reset selected slot when date or service changes
    }
  }, [selectedDate, selectedService, timeSlots, getAvailableSlots]);

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  const handleSlotChange = (value: string) => {
    setSelectedSlot(value);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a service and time slot.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // Get selected service and slot details
      const service = services.find(s => s.id === selectedService);
      const slot = timeSlots.find(s => s.id === selectedSlot);

      if (!service || !slot) {
        throw new Error("Service or time slot not found.");
      }

      // Create appointment
      const appointmentId = addAppointment({
        userId,
        userName,
        serviceId: service.id,
        serviceName: service.name,
        slotId: slot.id,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      if (!appointmentId) {
        throw new Error("Failed to create appointment.");
      }

      // Create payment record
      addPayment({
        appointmentId,
        userId,
        userName,
        amount: service.price,
        date: selectedDate,
        paymentMethod: "card", // Default to card payment
        service: service.name,
      });

      // Success notification
      toast({
        title: "Booking Successful!",
        description: `Your ${service.name} appointment has been booked for ${format(new Date(selectedDate), "MMMM d")} at ${slot.startTime}.`,
      });

      // Reset form
      setSelectedService("");
      setSelectedSlot("");
      setNotes("");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Book an Appointment</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Service & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex justify-between">
                      <span>{service.name}</span>
                      <span className="ml-2 text-gray-500">
                        (${service.price} - {service.duration}min)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Select value={selectedDate} onValueChange={handleDateChange}>
              <SelectTrigger id="date">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map(date => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Time Slot</Label>
            {selectedService && availableSlots.length > 0 ? (
              <Select value={selectedSlot} onValueChange={handleSlotChange}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.startTime} - {slot.endTime} ({slot.maxBookings - slot.currentBookings} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-gray-200 p-3 text-gray-500">
                {!selectedService 
                  ? "Please select a service first"
                  : availableSlots.length === 0 
                    ? "No available slots for this date" 
                    : "Loading available slots..."}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests or Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or things we should know..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Book Button */}
          <Button 
            className="w-full"
            disabled={!selectedService || !selectedSlot || isBooking}
            onClick={handleBooking}
          >
            {isBooking ? "Processing..." : "Book Appointment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 