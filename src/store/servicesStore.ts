import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service } from '@/types';

interface ServicesState {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getService: (id: string) => Service | undefined;
  getServicesByCategory: (category: string) => Service[];
}

const sampleServices: Service[] = [
  {
    id: "1",
    name: "Haircut",
    description: "Professional haircut and styling",
    duration: 30,
    price: 25.00,
    category: "Hair",
  },
  {
    id: "2",
    name: "Hair Color",
    description: "Full hair coloring service with premium products",
    duration: 120,
    price: 85.00,
    category: "Hair",
  },
  {
    id: "3",
    name: "Manicure",
    description: "Professional nail care and polish",
    duration: 45,
    price: 35.00,
    category: "Nails",
  },
  {
    id: "4",
    name: "Pedicure",
    description: "Relaxing foot care and polish",
    duration: 60,
    price: 45.00,
    category: "Nails",
  },
  {
    id: "5",
    name: "Facial",
    description: "Deep cleansing facial treatment",
    duration: 60,
    price: 75.00,
    category: "Skin",
  },
];

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      services: sampleServices,
      addService: (service) => {
        const newService: Service = {
          id: Date.now().toString(),
          ...service,
        };
        set((state) => ({
          services: [...state.services, newService],
        }));
      },
      updateService: (id, service) => {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...service } : s
          ),
        }));
      },
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
      },
      getService: (id) => {
        return get().services.find((s) => s.id === id);
      },
      getServicesByCategory: (category) => {
        return get().services.filter((s) => s.category === category);
      },
    }),
    {
      name: "services-storage",
    }
  )
);