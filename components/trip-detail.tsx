"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Map from "@/components/map";
// Use your sortable itinerary component that supports react-dnd reordering.
import SortableItinerary from "@/components/sortable-itinerary";

interface Location {
  id: string;
  location: string;
  lat: number;
  lng: number;
  order: number;
  createdAt: Date;
}

interface Trip {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date;
  locations: Location[];
}

interface TripDetailClientProps {
  trip: Trip;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Banner Image */}
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            {trip.title}
          </h1>
          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          {/* Assuming the "Add Location" route remains "/trips/[tripId]/itinerary/new" */}
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Add Location
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${
                          Math.round(
                            (trip.endDate.getTime() -
                              trip.startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1
                        } day(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Destinations</p>
                      <p className="text-sm text-gray-500">
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">
                {trip.description}
              </p>
            </div>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Full Itinerary</h2>
              <Link href={`/trips/${trip.id}/itinerary/new`}>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Location
                </Button>
              </Link>
            </div>
            {trip.locations.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">
                  Your itinerary is empty. Start by adding destinations to your
                  trip.
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="flex items-center justify-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Add First Location
                  </Button>
                </Link>
              </div>
            ) : (
              // Use SortableItinerary to allow drag-and-drop reordering.
              <SortableItinerary items={trip.locations} tripId={trip.id} />
            )}
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Map View</h2>
              <Link href={`/trips/${trip.id}/itinerary/new`}>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Location
                </Button>
              </Link>
            </div>
            <div className="h-[500px] rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="text-center p-4">
                <p className="text-gray-500 mb-4">
                  Add locations to see them on the map.
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="flex items-center justify-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Add First Location
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Back Navigation */}
      <div className="text-center">
        <Link href="/trips">
          <Button variant="outline" className="px-8 py-3 text-lg">
            Back to Trips
          </Button>
        </Link>
      </div>
    </div>
  );
}
