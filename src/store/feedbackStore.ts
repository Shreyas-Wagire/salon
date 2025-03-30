import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Feedback } from "@/types";

interface FeedbackStore {
  // Feedback data
  feedbacks: Feedback[];
  
  // CRUD operations
  addFeedback: (feedback: Omit<Feedback, "id">) => string;
  updateFeedback: (feedbackId: string, updates: Partial<Feedback>) => void;
  deleteFeedback: (feedbackId: string) => void;
  
  // Query operations
  getFeedbackByUserId: (userId: string) => Feedback[];
  getFeedbackByAppointmentId: (appointmentId: string) => Feedback | null;
  getFeedbackByDate: (date: string) => Feedback[];
  getAverageRating: () => number;
  getAverageRatingByService: (serviceName: string) => number;
}

// Mock initial feedback for demo purposes
const initialFeedbacks: Feedback[] = [
  {
    id: uuid(),
    userId: "user-1",
    userName: "John Doe",
    appointmentId: "appt-1",
    rating: 5,
    comment: "Great haircut, very professional service!",
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: uuid(),
    userId: "user-2",
    userName: "Jane Smith",
    appointmentId: "appt-2",
    rating: 4,
    comment: "Loved the hair coloring, just a bit of wait time.",
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: uuid(),
    userId: "user-3",
    userName: "Bob Johnson",
    appointmentId: "appt-3",
    rating: 5,
    comment: "Excellent manicure service, will come again!",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
  },
  {
    id: uuid(),
    userId: "user-4",
    userName: "Alice Williams",
    appointmentId: "appt-4",
    rating: 3,
    comment: "Facial was good but could be improved. Staff was friendly.",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
  },
  {
    id: uuid(),
    userId: "user-5",
    userName: "Charlie Brown",
    appointmentId: "appt-5",
    rating: 4,
    comment: "Good haircut, exactly what I asked for.",
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
  },
];

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  // Initialize feedbacks
  feedbacks: initialFeedbacks,
  
  // CRUD operations
  addFeedback: (feedback) => {
    const feedbackId = uuid();
    const newFeedback: Feedback = {
      id: feedbackId,
      ...feedback,
    };
    
    set((state) => ({
      feedbacks: [...state.feedbacks, newFeedback],
    }));
    
    return feedbackId;
  },
  
  updateFeedback: (feedbackId, updates) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, ...updates } : feedback
      ),
    }));
  },
  
  deleteFeedback: (feedbackId) => {
    set((state) => ({
      feedbacks: state.feedbacks.filter((feedback) => feedback.id !== feedbackId),
    }));
  },
  
  // Query operations
  getFeedbackByUserId: (userId) => {
    return get().feedbacks.filter((feedback) => feedback.userId === userId);
  },
  
  getFeedbackByAppointmentId: (appointmentId) => {
    return get().feedbacks.find((feedback) => feedback.appointmentId === appointmentId) || null;
  },
  
  getFeedbackByDate: (date) => {
    return get().feedbacks.filter((feedback) => feedback.date === date);
  },
  
  getAverageRating: () => {
    const feedbacks = get().feedbacks;
    if (feedbacks.length === 0) return 0;
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return totalRating / feedbacks.length;
  },
  
  getAverageRatingByService: (serviceName) => {
    // In a real app, we would link feedback to services
    // For this demo, we'll just return the overall average
    return get().getAverageRating();
  },
})); 