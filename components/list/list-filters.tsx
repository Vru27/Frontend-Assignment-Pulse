'use client';

import { useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useCategories } from '@/lib/hooks';

interface ListFiltersProps {
  search: string;
  category: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc') => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ListFilters({
  search,
  category,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
  isLoading = false,
}: ListFiltersProps) {
  const { data: categories = [] } = useCategories();

  const hasActiveFilters = useMemo(
    () => search !== '' || category !== 'all' || sortBy !== 'price-asc',
    [search, category, sortBy]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3 flex-col md:flex-row">
        {/* Search */}
        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Search
          </label>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
            aria-label="Search products"
          />
        </div>

 
        <div className="w-full md:w-48">
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Category
          </label>
          <Select value={category} onValueChange={onCategoryChange} disabled={isLoading}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories && Array.isArray(categories) && categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : String(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={onSortChange} disabled={isLoading}>
            <SelectTrigger aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              <SelectItem value="title-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isLoading}
            className="w-full md:w-auto"
            aria-label="Reset filters"
          >
            <X className="mr-2 size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
