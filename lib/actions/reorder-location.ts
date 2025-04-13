"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function reorderItineraries(tripId: string, newOrder: string[]) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // Update each location with its new order value in a transaction
  await prisma.$transaction(
    newOrder.map((locationId: string, index: number) =>
      prisma.location.update({
        where: { id: locationId },
        data: { order: index },
      })
    )
  );
}
