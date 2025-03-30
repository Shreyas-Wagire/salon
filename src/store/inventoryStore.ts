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
    name: "Professional Hair Shampoo",
    category: "Hair Care",
    currentQuantity: 15,
    idealQuantity: 50,
    price: 19.99,
    lowStockAlert: 20,
    supplier: "Beauty Supplies Co.",
    lastRestocked: "2024-03-01",
    imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Deep Conditioning Treatment",
    category: "Hair Care",
    currentQuantity: 25,
    idealQuantity: 50,
    price: 24.99,
    lowStockAlert: 20,
    supplier: "Beauty Supplies Co.",
    lastRestocked: "2024-03-01",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Nail Polish Set",
    category: "Nail Care",
    currentQuantity: 45,
    idealQuantity: 60,
    price: 39.99,
    lowStockAlert: 15,
    supplier: "Nail Art Pro",
    lastRestocked: "2024-03-10",
    imageUrl: "https://images.unsplash.com/photo-1610992018333-f839b4debe82?w=500&h=500&fit=crop",
  },
  {
    id: "5",
    name: "Facial Cleanser",
    category: "Skin Care",
    currentQuantity: 30,
    idealQuantity: 40,
    price: 34.99,
    lowStockAlert: 15,
    supplier: "Skin Care Plus",
    lastRestocked: "2024-03-05",
    imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=500&fit=crop",
  },
  {
    id: "6",
    name: "Hair Styling Gel",
    category: "Hair Care",
    currentQuantity: 12,
    idealQuantity: 30,
    price: 22.99,
    lowStockAlert: 10,
    supplier: "Beauty Supplies Co.",
    lastRestocked: "2024-02-28",
    imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop",
  },
  {
    id: "7",
    name: "Nail File Set",
    category: "Nail Care",
    currentQuantity: 50,
    idealQuantity: 70,
    price: 19.99,
    lowStockAlert: 20,
    supplier: "Nail Art Pro",
    lastRestocked: "2024-03-15",
    imageUrl: "https://images.unsplash.com/photo-1610992018333-f839b4debe82?w=500&h=500&fit=crop",
  },
  {
    id: "8",
    name: "Face Moisturizer",
    category: "Skin Care",
    currentQuantity: 28,
    idealQuantity: 40,
    price: 42.99,
    lowStockAlert: 15,
    supplier: "Skin Care Plus",
    lastRestocked: "2024-03-08",
    imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=500&fit=crop",
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