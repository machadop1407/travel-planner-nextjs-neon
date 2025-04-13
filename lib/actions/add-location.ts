"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google API key is not set in the environment variables.");
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch geocode data.");
  }
  const data = await response.json();
  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error("No geocoding results found.");
  }
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address");
  }

  const { lat, lng } = await geocodeAddress(address);

  // Count the current number of locations so we can add the new one at the end
  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      location: address,
      lat,
      lng,
      tripId,
      order: count, // assuming count is used as the order
    },
  });
  redirect(`/trips/${tripId}`);
}
