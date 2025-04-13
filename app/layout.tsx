// app/layout.tsx
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import Footer from "@/components/footer";

export const metadata = {
  title: "Travel Planner",
  description:
    "Plan your trips, explore new destinations, and create unforgettable memories.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SessionProvider>
          <Navbar session={session} />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
