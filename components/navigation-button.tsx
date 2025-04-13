"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth-actions";

export interface NavigationButtonProps {
  children: React.ReactNode;
  className?: string;
  isLoggedIn: boolean;
}

export default function NavigationButton({
  children,
  className,
  isLoggedIn,
}: NavigationButtonProps) {
  const handleNavigation = () => {
    if (isLoggedIn) {
      redirect("/dashboard");
    } else {
      login();
    }
  };
  return (
    <Button
      size="lg"
      variant={"outline"}
      onClick={handleNavigation}
      className={`cursor-pointer ${className || ""}`}
    >
      {children}
    </Button>
  );
}
