"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { InventoryItem as InventoryItemType } from "@/types";

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdate: (id: string, item: Omit<InventoryItemType, "id">) => void;
  onDelete: (id: string) => void;
}

export function InventoryItem({ item, onUpdate, onDelete }: InventoryItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    currentQuantity: item.currentQuantity,
    idealQuantity: item.idealQuantity,
    price: item.price,
    lowStockAlert: item.lowStockAlert,
    supplier: item.supplier || "",
    lastRestocked: item.lastRestocked,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "currentQuantity" || name === "idealQuantity" || name === "price" || name === "lowStockAlert"
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, formData);
    setIsDialogOpen(false);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(item.id);
    }
  };

  const isLowStock = item.currentQuantity <= item.lowStockAlert;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.name}</span>
          <span className={`text-sm font-normal ${isLowStock ? "text-red-500" : "text-slate-500"}`}>
            {isLowStock ? "Low Stock" : "In Stock"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Category:</span>
            <span className="font-medium">{item.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Quantity:</span>
            <span className="font-medium">{item.currentQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ideal Quantity:</span>
            <span className="font-medium">{item.idealQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Price:</span>
            <span className="font-medium">${item.price.toFixed(2)}</span>
          </div>
          {item.supplier && (
            <div className="flex justify-between">
              <span className="text-slate-500">Supplier:</span>
              <span className="font-medium">{item.supplier}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Last Restocked:</span>
            <span className="font-medium">{new Date(item.lastRestocked).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            View Details
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Item" : "Item Details"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentQuantity">Current Quantity</Label>
              <Input
                id="currentQuantity"
                name="currentQuantity"
                type="number"
                value={formData.currentQuantity}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idealQuantity">Ideal Quantity</Label>
              <Input
                id="idealQuantity"
                name="idealQuantity"
                type="number"
                value={formData.idealQuantity}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
              <Input
                id="lowStockAlert"
                name="lowStockAlert"
                type="number"
                value={formData.lowStockAlert}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <DialogFooter>
              {isEditMode ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button type="button" onClick={() => setIsEditMode(true)}>
                    Edit
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 