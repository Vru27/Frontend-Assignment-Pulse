import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatPrice, formatStockStatus, truncateText } from '@/lib/utils-custom';

interface ProductCardProps {
  product: Product;
  onCardClick?: () => void;
}

export function ProductCard({ product, onCardClick }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const stockStatus = formatStockStatus(product.stock);

  return (
    <Link href={`/product/${product.id}`} onClick={onCardClick}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow hover:border-primary/50">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              -{Math.round(product.discountPercentage)}%
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-base">
            {product.title}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {product.category}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">

          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncateText(product.description, 100)}
          </p>

          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span>{'★'.repeat(Math.round(product.rating))}</span>
              <span className="text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <Badge variant={stockStatus.variant} className="text-xs">
              {stockStatus.text}
            </Badge>
          </div>

          <Button variant="outline" size="sm" className="w-full group">
            View Details
            <ArrowRight className="ml-2 size-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
