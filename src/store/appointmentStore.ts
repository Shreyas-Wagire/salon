import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
  maxBookings: number;
  currentBookings: number;
  customerName?: string;
}

interface AppointmentStore {
  businessHours: {
    start: string;
    end: string;
    maxBookingsPerSlot: number;
  };
  timeSlots: TimeSlot[];
  updateBusinessHours: (start: string, end: string, maxBookings: number) => void;
  generateTimeSlots: () => void;
  bookTimeSlot: (slotId: string, customerName: string) => void;
  cancelBooking: (slotId: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      businessHours: {
        start: "09:00",
        end: "17:00",
        maxBookingsPerSlot: 2,
      },
      timeSlots: [],

      updateBusinessHours: (start, end, maxBookings) => {
        set({ businessHours: { start, end, maxBookings } });
        get().generateTimeSlots();
      },

      generateTimeSlots: () => {
        const { start, end, maxBookingsPerSlot } = get().businessHours;
        const slots: TimeSlot[] = [];
        
        let currentTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        
        while (currentTime < endTime) {
          const timeString = currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          
          slots.push({
            id: timeString,
            time: timeString,
            isBooked: false,
            maxBookings: maxBookingsPerSlot,
            currentBookings: 0,
          });
          
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        
        set({ timeSlots: slots });
      },

      bookTimeSlot: (slotId, customerName) => {
        set(state => ({
          timeSlots: state.timeSlots.map(slot =>
            slot.id === slotId
              ? {
                  ...slot,
                  currentBookings: slot.currentBookings + 1,
                  isBooked: slot.currentBookings + 1 >= slot.maxBookings,
                  customerName: customerName,
                }
              : slot
          ),
        }));
      },

      cancelBooking: (slotId) => {
        set(state => ({
          timeSlots: state.timeSlots.map(slot =>
            slot.id === slotId
              ? {
                  ...slot,
                  currentBookings: Math.max(0, slot.currentBookings - 1),
                  isBooked: false,
                  customerName: undefined,
                }
              : slot
          ),
        }));
      },
    }),
    {
      name: 'appointment-store',
    }
  )
);