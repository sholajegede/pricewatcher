import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";
import { getAllProducts } from "@/lib/actions"

export async function ProductCarousel() {
  const allProducts = await getAllProducts();
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {allProducts?.map((product) => (
          <CarouselItem key={product._id} className="basis-1/2 sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
            <ProductCard key={product._id} product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}