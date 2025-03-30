"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, CreditCard, Users, Scissors } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Salon Management System
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A comprehensive solution for managing your salon business. Streamline appointments, 
            track inventory, and handle payments all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/admin/dashboard">
              <Button size="lg">
                Get Started
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold mb-12">Key Features</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Efficiently manage client appointments and scheduling. Keep track of your daily, 
                weekly, and monthly bookings with ease.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <Package className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track salon products and supplies. Get alerts for low stock items and manage 
                your inventory efficiently.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Handle payments and financial records seamlessly. Generate reports and track 
                your salon's revenue.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Maintain detailed client profiles, preferences, and history. Build stronger 
                relationships with your customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <Scissors className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage your service catalog with detailed descriptions, pricing, and duration. 
                Keep your offerings up to date.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 transition-all hover:border-primary/40">
            <CardHeader>
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <CardTitle className="mt-4">Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get insights into your business performance with detailed reports and analytics. 
                Make data-driven decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Salon?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start managing your salon more efficiently today.
          </p>
          <Link href="/admin/dashboard">
            <Button size="lg" className="font-semibold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
