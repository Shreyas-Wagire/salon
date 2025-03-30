import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryItem } from "@/types";

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id">) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => InventoryItem | undefined;
  getItemsByCategory: (category: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
}

const sampleItems: InventoryItem[] = [
  {
    id: "1",
    name: "Shampoo",
    category: "Hair Care",
    currentQuantity: 15,
    idealQuantity: 50,
    price: 19.99,
    lowStockAlert: 20,
    supplier: "Beauty Supplies Co.",
    lastRestocked: "2024-03-01",
  },
  {
    id: "2",
    name: "Conditioner",
    category: "Hair Care",
    currentQuantity: 25,
    idealQuantity: 50,
    price: 24.99,
    lowStockAlert: 20,
    supplier: "Beauty Supplies Co.",
    lastRestocked: "2024-03-01",
  },
  {
    id: "3",
    name: "Hair Color - Black",
    category: "Hair Color",
    currentQuantity: 8,
    idealQuantity: 30,
    price: 29.99,
    lowStockAlert: 10,
    supplier: "Color Masters Inc.",
    lastRestocked: "2024-02-15",
  },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: sampleItems,
      
      addItem: (item) => {
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          ...item,
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },
      
      updateItem: (id, item) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...item } : i
          ),
        }));
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      
      getItem: (id) => {
        return get().items.find((i) => i.id === id);
      },
      
      getItemsByCategory: (category) => {
        return get().items.filter((i) => i.category === category);
      },
      
      getLowStockItems: () => {
        return get().items.filter((i) => i.currentQuantity <= i.lowStockAlert);
      },
    }),
    {
      name: "inventory-storage",
    }
  )
); 