import Image from "next/image";
import { Product } from '@/types';
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image as string}
              alt={product.title}
              width={200}
              height={200}
              className="object-contain w-full h-full bg-transparent transition-transform group-hover:scale-105"
              unoptimized={true}
              quality={100}
            />
            {product.discountRate && (
              <Badge className="absolute right-2 top-2 bg-green-500">
                -{product.discountRate}%
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">{formatPrice(product.currentPrice)}</span>
                {product.originalPrice > product.currentPrice && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProductCard