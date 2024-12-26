"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GaugeCircle } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GaugeCircle className="h-6 w-6" />
          <span className="font-bold">PriceWatcher</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/products">
            <Button variant="ghost">Products</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}