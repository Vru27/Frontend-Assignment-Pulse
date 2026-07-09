'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProductDetail } from '@/lib/hooks';
import { formatPrice, formatStockStatus, calculateDiscountedPrice } from '@/lib/utils-custom';
import { DetailSkeleton, DetailErrorState, DetailNotFound } from '@/components/detail/detail-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params: paramsPromise }: ProductPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = parseInt(params.id, 10);
  const queryString = searchParams.toString();
  const backUrl = queryString ? `/explore?${queryString}` : '/explore';
  const { data: product, isLoading, error, refetch, isError } = useProductDetail(productId);

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link href={backUrl} className="inline-flex items-center gap-2 mb-6 text-primary hover:underline">
            <ArrowLeft className="size-4" />
            Back to Products
          </Link>
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link href={backUrl} className="inline-flex items-center gap-2 mb-6 text-primary hover:underline">
            <ArrowLeft className="size-4" />
            Back to Products
          </Link>

          {isError ? (
            <DetailErrorState
              error={error?.message || 'Failed to load product details'}
              onRetry={() => refetch()}
              onBack={() => router.push(backUrl)}
            />
          ) : (
            <DetailNotFound onBack={() => router.push(backUrl)} />
          )}
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const stockStatus = formatStockStatus(product.stock);
  const avgRating = Math.round(product.rating);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href={backUrl} className="inline-flex items-center gap-2 mb-6 text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {product.discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-lg">
                  Save {Math.round(product.discountPercentage)}%
                </Badge>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative h-20 rounded border border-border overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < avgRating ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sale Price</span>
                  <span className="text-2xl font-bold text-foreground">{formatPrice(discountedPrice)}</span>
                </div>
                {product.discountPercentage > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Regular Price</span>
                    <span className="line-through text-muted-foreground">{formatPrice(product.price)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stock</span>
                    <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{product.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span>{product.availabilityStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Order</span>
                  <span>{product.minimumOrderQuantity}</span>
                </div>
              </CardContent>
            </Card>

            <Button disabled={product.stock === 0} size="lg" className="w-full">
              <ShoppingCart className="mr-2 size-4" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.shippingInformation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.returnPolicy}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Warranty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.warrantyInformation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dimensions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.slice(0, 3).map((review, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{review.reviewerName}</p>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
