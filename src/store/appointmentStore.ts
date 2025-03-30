import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Appointment, Service, TimeSlot, BusinessHours } from "@/types";
import { format, parse, addMinutes } from "date-fns";

interface AppointmentStore {
  // Services data
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (serviceId: string, updates: Partial<Service>) => void;
  removeService: (serviceId: string) => void;
  
  // Business hours
  businessHours: BusinessHours[];
  setBusinessHours: (hours: BusinessHours[]) => void;
  updateBusinessHour: (dayOfWeek: number, updates: Partial<BusinessHours>) => void;
  
  // Time slots data
  timeSlots: TimeSlot[];
  generateTimeSlots: (date: string, slotDuration?: number) => void;
  getAvailableSlots: (date: string, serviceId: string) => TimeSlot[];
  bookSlot: (slotId: string) => boolean;
  cancelSlot: (slotId: string) => boolean;
  
  // Appointments data
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id" | "status" | "paymentStatus">) => string;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (appointmentId: string) => void;
  getAppointmentsByUserId: (userId: string) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsBySlot: (slotId: string) => Appointment[];
  getAppointmentDetails: (appointmentId: string) => { appointment: Appointment | null, service: Service | null };
}

// Initialize with demo data
const defaultBusinessHours: BusinessHours[] = [
  { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isOpen: false }, // Sunday, closed
  { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isOpen: true },  // Monday
  { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isOpen: true },  // Tuesday
  { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isOpen: true },  // Wednesday
  { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isOpen: true },  // Thursday
  { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isOpen: true },  // Friday
  { dayOfWeek: 6, openTime: "10:00", closeTime: "16:00", isOpen: true },  // Saturday
];

const initialServices: Service[] = [
  { 
    id: uuid(), 
    name: "Haircut", 
    description: "Professional haircut and styling",
    price: 45,
    duration: 45, // 45 minutes
    image: "/services/haircut.jpg"
  },
  { 
    id: uuid(), 
    name: "Hair Coloring", 
    description: "Full hair coloring service with premium products",
    price: 90,
    duration: 120, // 2 hours
    image: "/services/coloring.jpg" 
  },
  { 
    id: uuid(), 
    name: "Manicure", 
    description: "Professional nail treatment and polish",
    price: 35,
    duration: 30, // 30 minutes
    image: "/services/manicure.jpg" 
  },
  { 
    id: uuid(), 
    name: "Facial", 
    description: "Rejuvenating facial treatment",
    price: 70,
    duration: 60, // 60 minutes
    image: "/services/facial.jpg" 
  },
];

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  // Initialize services
  services: initialServices,

  // Service CRUD operations
  addService: (service) => {
    set((state) => ({
      services: [...state.services, { ...service, id: uuid() }],
    }));
  },
  
  updateService: (serviceId, updates) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId ? { ...service, ...updates } : service
      ),
    }));
  },
  
  removeService: (serviceId) => {
    set((state) => ({
      services: state.services.filter((service) => service.id !== serviceId),
    }));
  },
  
  // Business hours
  businessHours: defaultBusinessHours,
  
  setBusinessHours: (hours) => {
    set({ businessHours: hours });
  },
  
  updateBusinessHour: (dayOfWeek, updates) => {
    set((state) => ({
      businessHours: state.businessHours.map((hour) => 
        hour.dayOfWeek === dayOfWeek ? { ...hour, ...updates } : hour
      )
    }));
  },
  
  // Time slots
  timeSlots: [],
  
  generateTimeSlots: (date, slotDuration = 30) => {
    const dayOfWeek = new Date(date).getDay();
    const businessHour = get().businessHours.find(hour => hour.dayOfWeek === dayOfWeek);
    
    // If business is closed on this day, return empty array
    if (!businessHour || !businessHour.isOpen) {
      set({ timeSlots: get().timeSlots.filter(slot => slot.date !== date) });
      return;
    }
    
    // Parse time strings
    const openDateTime = parse(`${date} ${businessHour.openTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const closeDateTime = parse(`${date} ${businessHour.closeTime}`, 'yyyy-MM-dd HH:mm', new Date());
    
    const slots: TimeSlot[] = [];
    let currentTime = new Date(openDateTime);
    
    // Create slots from opening time until closing time
    while (currentTime < closeDateTime) {
      const startTime = format(currentTime, 'HH:mm');
      const endTimeDate = addMinutes(currentTime, slotDuration);
      
      // Skip if this would go past closing time
      if (endTimeDate > closeDateTime) break;
      
      const endTime = format(endTimeDate, 'HH:mm');
      
      // Check if the slot already exists
      const existingSlot = get().timeSlots.find(
        slot => 
          slot.date === date && 
          slot.startTime === startTime && 
          slot.endTime === endTime
      );
      
      if (existingSlot) {
        // Keep existing slot data
        slots.push(existingSlot);
      } else {
        // Create new slot
        slots.push({
          id: uuid(),
          date,
          startTime,
          endTime,
          isBooked: false,
          maxBookings: 3, // Default max bookings per slot
          currentBookings: 0,
        });
      }
      
      // Move to the next slot
      currentTime = endTimeDate;
    }
    
    // Save generated slots, replacing any existing slots for this date
    set((state) => ({
      timeSlots: [
        ...state.timeSlots.filter(slot => slot.date !== date),
        ...slots
      ]
    }));
  },
  
  getAvailableSlots: (date, serviceId) => {
    const { timeSlots, services } = get();
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return [];
    
    const slotsForDate = timeSlots.filter(slot => slot.date === date);
    
    // Filter slots that have availability
    return slotsForDate.filter(slot => slot.currentBookings < slot.maxBookings);
  },
  
  bookSlot: (slotId) => {
    let success = false;
    
    set((state) => {
      const slotIndex = state.timeSlots.findIndex(slot => slot.id === slotId);
      
      if (slotIndex === -1) return state;
      
      const slot = state.timeSlots[slotIndex];
      
      // Check if slot can be booked
      if (slot.currentBookings < slot.maxBookings) {
        const updatedSlots = [...state.timeSlots];
        updatedSlots[slotIndex] = {
          ...slot,
          currentBookings: slot.currentBookings + 1,
          isBooked: slot.currentBookings + 1 >= slot.maxBookings
        };
        
        success = true;
        return { timeSlots: updatedSlots };
      }
      
      return state;
    });
    
    return success;
  },
  
  cancelSlot: (slotId) => {
    let success = false;
    
    set((state) => {
      const slotIndex = state.timeSlots.findIndex(slot => slot.id === slotId);
      
      if (slotIndex === -1) return state;
      
      const slot = state.timeSlots[slotIndex];
      
      // Check if slot has bookings to cancel
      if (slot.currentBookings > 0) {
        const updatedSlots = [...state.timeSlots];
        updatedSlots[slotIndex] = {
          ...slot,
          currentBookings: slot.currentBookings - 1,
          isBooked: false
        };
        
        success = true;
        return { timeSlots: updatedSlots };
      }
      
      return state;
    });
    
    return success;
  },

  // Appointments
  appointments: [],
  
  addAppointment: (appointmentData) => {
    const appointmentId = uuid();
    
    // Get slot and service info
    const slot = get().timeSlots.find(slot => slot.id === appointmentData.slotId);
    const service = get().services.find(service => service.id === appointmentData.serviceId);
    
    if (!slot || !service) return "";
    
    // Book the slot
    const booked = get().bookSlot(appointmentData.slotId);
    
    if (!booked) return "";
    
    const newAppointment: Appointment = {
      id: appointmentId,
      ...appointmentData,
      status: "pending",
      paymentStatus: "pending",
    };
    
    set((state) => ({
      appointments: [...state.appointments, newAppointment],
    }));
    
    return appointmentId;
  },
  
  updateAppointment: (appointmentId, updates) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, ...updates }
          : appointment
      ),
    }));
  },
  
  cancelAppointment: (appointmentId) => {
    const appointment = get().appointments.find(a => a.id === appointmentId);
    
    if (!appointment) return;
    
    // Update the appointment status
    get().updateAppointment(appointmentId, { status: "cancelled" });
    
    // Free up the slot
    get().cancelSlot(appointment.slotId);
  },
  
  getAppointmentsByUserId: (userId) => {
    return get().appointments.filter(appointment => appointment.userId === userId);
  },
  
  getAppointmentsByDate: (date) => {
    return get().appointments.filter(appointment => appointment.date === date);
  },
  
  getAppointmentsBySlot: (slotId) => {
    return get().appointments.filter(appointment => appointment.slotId === slotId);
  },
  
  getAppointmentDetails: (appointmentId) => {
    const appointment = get().appointments.find(a => a.id === appointmentId) || null;
    let service = null;
    
    if (appointment) {
      service = get().services.find(s => s.id === appointment.serviceId) || null;
    }
    
    return { appointment, service };
  },
})); 