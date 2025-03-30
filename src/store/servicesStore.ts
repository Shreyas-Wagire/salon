import { create } from 'zustand';
import { Service } from '@/types';

interface ServicesState {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getService: (id: string) => Service | undefined;
  getServicesByCategory: (category: string) => Service[];
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
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
})); 