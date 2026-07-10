'use client';

import { Grid } from 'react-window';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface VirtualizedProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick: (id: number) => void;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 400;
const GAP = 16;

export function VirtualizedProductGrid({
  products,
  isLoading,
  onProductClick,
}: VirtualizedProductGridProps) {
  // Calculate columns based on container width (assuming max width of 1400px with padding)
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1400;
  const columns = Math.max(1, Math.floor((containerWidth - 16) / (CARD_WIDTH + GAP)));
  const rows = Math.ceil(products.length / columns);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const index = rowIndex * columns + columnIndex;
    if (index >= products.length) return null;

    const product = products[index];
    return (
      <div
        style={{
          ...style,
          left: (style.left as number) + GAP / 2,
          top: (style.top as number) + GAP / 2,
        }}
        className="flex cursor-pointer"
        onClick={() => onProductClick(product.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onProductClick(product.id);
        }}
      >
        <ProductCard product={product} />
      </div>
    );
  };

  return (
    <Grid
      columnCount={columns}
      columnWidth={CARD_WIDTH + GAP}
      height={600}
      rowCount={rows}
      rowHeight={CARD_HEIGHT + GAP}
      width={containerWidth}
    >
      {Cell}
    </Grid>
  );
}
