"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInventoryStore } from "@/store/inventoryStore";
import { Search } from "lucide-react";
import Image from "next/image";

export default function InventoryPage() {
  const { items } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on search query
  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="text-slate-500">Browse our selection of salon products</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {item.imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className={`text-sm font-normal ${item.currentQuantity <= item.lowStockAlert ? "text-red-500" : "text-green-500"}`}>
                  {item.currentQuantity <= item.lowStockAlert ? "Low Stock" : "In Stock"}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 