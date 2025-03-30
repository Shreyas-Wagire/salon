"use client";

import React, { useState } from "react";
import { useFeedbackStore } from "@/store/feedbackStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClientFeedbackContentProps {
  userId: string;
  userName: string;
}

export function ClientFeedbackContent({ userId, userName }: ClientFeedbackContentProps) {
  const { appointments } = useAppointmentStore();
  const { addFeedback } = useFeedbackStore();
  
  const [serviceId, setServiceId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // Get completed appointments for this user
  const completedAppointments = appointments.filter(
    app => app.userId === userId && app.status === "completed"
  );
  
  // Get unique services from the completed appointments
  const uniqueServices = Array.from(
    new Set(completedAppointments.map(app => app.service))
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId || !rating) return;
    
    const selectedAppointment = completedAppointments.find(app => app.service === serviceId);
    
    if (!selectedAppointment) return;
    
    const feedback = {
      id: `feedback-${Date.now()}`,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
      service: selectedAppointment.service,
    };
    
    addFeedback(feedback);
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your feedback has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <p className="text-slate-600">
              We appreciate your feedback and will use it to improve our services.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setSubmitted(false)}>
              Submit Another Feedback
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Share Your Experience</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            We value your opinion. Please tell us about your experience with our services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAppointments.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a service...</option>
                  {uniqueServices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rating
                </label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-3xl focus:outline-none"
                    >
                      {star <= rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-slate-300">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Comments
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  rows={4}
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={!serviceId || !rating}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center text-slate-500">
              <div className="mb-4 text-5xl">🔍</div>
              <p className="mb-4">You don't have any completed appointments yet.</p>
              <p>Book and complete a service to leave feedback.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 