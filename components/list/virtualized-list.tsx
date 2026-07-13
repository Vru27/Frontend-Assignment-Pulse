'use client';

import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface VirtualizedProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick: (id: number) => void;
}

export function VirtualizedProductGrid({
  products,
  isLoading,
  onProductClick,
}: VirtualizedProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        Loading...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="cursor-pointer"
          onClick={() => onProductClick(product.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onProductClick(product.id);
            }
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}