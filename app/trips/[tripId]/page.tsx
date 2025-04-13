// app/trips/[tripId]/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import TripDetailClient from "@/components/trip-detail";

export default async function TripDetail({
  params,
}: {
  params: { tripId: string };
}) {
  const session = await auth();
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl text-gray-700">
        Please sign in.
      </div>
    );
  }

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl text-gray-700">
        Trip not found.
      </div>
    );
  }

  return <TripDetailClient trip={trip} />;
}
