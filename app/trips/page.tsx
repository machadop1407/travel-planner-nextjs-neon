// app/trips/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TripsPage() {
  // Verify that the user is signed in.
  const session = await auth();
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please sign in.
      </div>
    );
  }

  // Retrieve the user's trips, including locations.
  const trips = await prisma.trip.findMany({
    where: { userId: session.user?.id },
    include: { locations: true },
  });

  // Sort trips by start date (most recent first).
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Calculate upcoming trips (where the start date is today or later).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  // Calculate the total number of locations across all trips.
  const totalLocations = trips.reduce(
    (total, trip) => total + (trip.locations?.length || 0),
    0
  );

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button>
            New Trip
          </Button>
        </Link>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length === 0
              ? "Start planning your first trip by clicking the 'New Trip' button above."
              : `You have ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. ${
                  upcomingTrips.length > 0
                    ? `${upcomingTrips.length} upcoming.`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Recent Trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No trips yet</h3>
              <p className="text-center mb-4 max-w-md">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href="/trips/new">
                <Button>Create Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">
                      {trip.description || "No description"}
                    </p>
                    <div className="text-sm">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm">
                      {trip.locations?.length || 0}{" "}
                      {trip.locations?.length === 1 ? "location" : "locations"}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {trips.length > 6 && (
          <div className="flex justify-center mt-6">
            <Link href="/trips">
              <Button variant="outline">View all trips</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
