"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { InventoryItem } from "@/components/InventoryItem";
import { useInventoryStore } from "@/store/inventoryStore";
import { Package, Plus, Search, Filter } from "lucide-react";
import { InventoryItem as InventoryItemType } from "@/types";

export function AdminInventoryContent() {
  const { items, addItem, updateItem, deleteItem } = useInventoryStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterLowStock, setFilterLowStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<Omit<InventoryItemType, "id">>({
    name: "",
    category: "",
    currentQuantity: 0,
    idealQuantity: 50,
    price: 0,
    lowStockAlert: 10,
    supplier: "",
    lastRestocked: new Date().toISOString().split('T')[0],
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  // Filter items
  let filteredItems = [...items];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.supplier?.toLowerCase() || "").includes(query)
    );
  }
  
  // Apply category filter
  if (filterCategory) {
    filteredItems = filteredItems.filter(item => item.category === filterCategory);
  }
  
  // Apply low stock filter
  if (filterLowStock) {
    filteredItems = filteredItems.filter(item => item.currentQuantity <= item.lowStockAlert);
  }
  
  // Sort items
  if (sortBy === "name") {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "price-asc") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortBy === "quantity") {
    filteredItems.sort((a, b) => a.currentQuantity - b.currentQuantity);
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "currentQuantity" || name === "idealQuantity" || name === "price" || name === "lowStockAlert"
        ? parseFloat(value) || 0 
        : value,
    }));
  };
  
  const handleAddItem = () => {
    addItem(formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      category: "",
      currentQuantity: 0,
      idealQuantity: 50,
      price: 0,
      lowStockAlert: 10,
      supplier: "",
      lastRestocked: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-slate-500">Manage your salon's inventory items</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {items.filter(item => item.currentQuantity <= item.lowStockAlert).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${items.reduce((sum, item) => sum + (item.price * item.currentQuantity), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Default</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={filterLowStock ? "default" : "outline"}
            onClick={() => setFilterLowStock(!filterLowStock)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Low Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentQuantity">Current Quantity</Label>
              <Input
                id="currentQuantity"
                name="currentQuantity"
                type="number"
                min={0}
                value={formData.currentQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idealQuantity">Ideal Quantity</Label>
              <Input
                id="idealQuantity"
                name="idealQuantity"
                type="number"
                min={0}
                value={formData.idealQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
              <Input
                id="lowStockAlert"
                name="lowStockAlert"
                type="number"
                min={0}
                value={formData.lowStockAlert}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 