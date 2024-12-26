import ProductCard from "@/components/product-card";
import { getAllProducts } from "@/lib/actions"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default async function ProductsPage() {
  const allProducts = await getAllProducts();
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">All Products</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
          <Button>Filter</Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allProducts?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}