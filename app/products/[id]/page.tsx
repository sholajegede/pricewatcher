import Modal from "@/components/modal";
import PriceInfoCard from "@/components/price-info-card";
import ProductCard from "@/components/product-card";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className="flex flex-col gap-16 flex-wrap px-6 md:px-20 py-24">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="flex-grow xl:max-w-[50%] max-w-full py-16 border border-[#CDDBFF] rounded-[17px]">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-primary font-semibold">
                {product.title}
              </p>

              <p className="text-base text-black opacity-50">
                {product.category} Category
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-10 py-6 border-y border-y-[#E4E4E4]">
            <div className="flex flex-col gap-5">
              <p className="text-[34px] text-primary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>

              <div className="relative">
                <p className="text-[21px] text-black opacity-50 line-through">
                  {product.currency} {formatNumber(product.originalPrice)}
                </p>

                <Badge className="absolute -top-4 -right-3 bg-green-400">
                  -{product.discountRate}%
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#FBF3EA] rounded-[27px]">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "0"}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-[27px]">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary font-semibold">
                    {product.reviewsCount.toLocaleString()} Reviews
                  </p>
                </div>
              </div>

              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">{product.recommendedBy || 83}%</span>{" "}
                of buyers have recommended this.
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
              />
            </div>
          </div>

          <Modal productId={id} />
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-primary font-semibold">
            About the product
          </h3>

          <div className="flex flex-col gap-4">
            {product?.description && (
              <div className="flex flex-col gap-2">
                <ul className="list-disc pl-5">
                  {product.description.split("\n").map((line, index) => {
                    const [key, ...valueParts] = line.split(":");
                    const value = valueParts.join(":").trim();
                    return (
                      <li key={index}>
                        {value ? (
                          <>
                            <strong>{key.trim()}:</strong> {value}
                          </>
                        ) : (
                          <>{key.trim()}</>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Button
          variant={"default"}
          className="w-fit bg-primary mx-auto rounded-full py-8 px-2 flex items-center justify-center gap-3 min-w-[200px]"
        >
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={30}
            height={30}
          />

          <Link href={product.url} target="_blank" className="text-base text-white">
            Shop Now
          </Link>
        </Button>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>

          <div className="">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {similarProducts?.map((product) => (
                  <CarouselItem
                    key={product._id}
                    className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                  >
                    <ProductCard key={product._id} product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;