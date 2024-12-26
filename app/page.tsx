import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/product-carousel";
import { ArrowRight, Bell, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import Searchbar from "@/components/searchbar";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:grid-cols-2 md:py-10">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Track Amazon prices,{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              save money
            </span>
          </h1>
          <p className="max-w-[500px] text-lg text-muted-foreground sm:text-xl">
            Never overpay again. Track prices, set alerts, and get instantly notified when
            prices drop on your favorite Amazon products.
          </p>
          
          <Searchbar />
        </div>
        <div className="hidden md:block">
          <ProductCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/40">
        <div className="container py-16">
          <h2 className="mb-10 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Search className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold">Track Products</h3>
              <p className="text-muted-foreground">
                Simply paste the Amazon product URL and we'll start tracking its price
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Bell className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold">Get Notified</h3>
              <p className="text-muted-foreground">
                Receive instant notifications when prices drop on your tracked items
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold">Save Money</h3>
              <p className="text-muted-foreground">
                Buy at the perfect time and save money on your purchases
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="container py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Trending Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <ProductCarousel />
      </section>
    </div>
  );
};