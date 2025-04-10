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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Service } from "@/types";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useServicesStore } from "@/store/servicesStore";

export function AdminServicesContent() {
  const { services, addService, updateService, deleteService } = useServicesStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "",
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(services.map(service => service.category)));
  
  // Filter services
  let filteredServices = [...services];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredServices = filteredServices.filter(
      service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
    );
  }
  
  // Apply category filter
  if (filterCategory) {
    filteredServices = filteredServices.filter(service => service.category === filterCategory);
  }
  
  // Sort services
  if (sortBy === "name") {
    filteredServices.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "price-asc") {
    filteredServices.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredServices.sort((a, b) => b.price - a.price);
  } else if (sortBy === "duration") {
    filteredServices.sort((a, b) => a.duration - b.duration);
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "duration" || name === "price"
        ? parseFloat(value) || 0 
        : value,
    }));
  };
  
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <= 0 || formData.duration <= 0) {
      alert("Please fill in all required fields with valid values");
      return;
    }
    addService(formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "",
    });
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !formData.name || !formData.category || formData.price <= 0 || formData.duration <= 0) {
      alert("Please fill in all required fields with valid values");
      return;
    }
    updateService(selectedService.id, formData);
    setIsEditDialogOpen(false);
    setSelectedService(null);
    setFormData({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "",
    });
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-slate-500">Manage your salon's services</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${services.length > 0 
                ? (services.reduce((sum, service) => sum + service.price, 0) / services.length).toFixed(2)
                : "0.00"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search services..."
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
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{service.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-bold">{service.duration} min</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="font-bold">${service.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-bold">{service.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddService} className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                value={formData.duration}
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
                step="0.01"
                value={formData.price}
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateService} className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                value={formData.duration}
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
                step="0.01"
                value={formData.price}
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}