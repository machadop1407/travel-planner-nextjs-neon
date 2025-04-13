"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "@/auth";
import { Session } from "next-auth";
import { login, logout } from "@/lib/auth-actions";
import Image from "next/image";
import logo from "/logo.png";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-white shadow-md py-4  border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
          <span className="text-2xl font-bold text-gray-800">
            Travel Planner
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Link href="/trips" className="text-slate-900 hover:text-sky-500">
                My Trips
              </Link>
              <div className="flex items-center space-x-2">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-slate-700">
                  @{session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
