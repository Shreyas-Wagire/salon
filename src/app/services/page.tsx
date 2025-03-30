"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServicesStore } from "@/store/servicesStore";

export default function ServicesPage() {
  const { services } = useServicesStore();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Our Services</h1>
        <p className="text-slate-500">Explore our range of salon services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
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
    </div>
  );
} 