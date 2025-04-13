"use client";
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type MapProps = {
  itineraries: { id: string; lat: number; lng: number; location: string }[];
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function Map({ itineraries }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
      {itineraries.map((item) => (
        <Marker
          key={item.id}
          position={{ lat: item.lat, lng: item.lng }}
          title={item.location}
        />
      ))}
    </GoogleMap>
  );
}
