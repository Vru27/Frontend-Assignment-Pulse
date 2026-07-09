'use client';

import { Suspense, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/lib/hooks';
import { ListFilters } from '@/components/list/list-filters';
import { ProductCard } from '@/components/list/product-card';
import { ListSkeleton, ListErrorState, ListEmptyState } from '@/components/list/list-skeleton';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { parseFilterParams, stringifyFilterParams, sortProducts } from '@/lib/utils-custom';

const ITEMS_PER_PAGE = 12;

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse URL params
  const filters = useMemo(() => parseFilterParams(searchParams), [searchParams]);

  const skip = (filters.page - 1) * ITEMS_PER_PAGE;

  // Fetch products
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(skip, ITEMS_PER_PAGE, filters.search, filters.category);

  // Apply client-side sorting
  const sortedProducts = useMemo(
    () => (productsData?.products ? sortProducts(productsData.products, filters.sortBy) : []),
    [productsData?.products, filters.sortBy]
  );

  // Update URL when filters change
  const updateUrl = useCallback((newParams: Partial<typeof filters>) => {
    const updated = { ...filters, ...newParams, page: newParams.page ?? 1 };
    const queryString = stringifyFilterParams(updated);
    startTransition(() => {
      router.push(`/explore?${queryString}`);
    });
  }, [filters, router]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateUrl({ search: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, updateUrl]);

  // Pagination calculations
  const total = productsData?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const canPrevious = filters.page > 1;
  const canNext = filters.page < totalPages;

  // Error handling
  if (productsError) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <ListErrorState
          error={productsError.message || 'Failed to load products'}
          onRetry={() => refetchProducts()}
        />
      </div>
    );
  }

  // Loading state
  if (isProductsLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <ListSkeleton count={ITEMS_PER_PAGE} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of {total} products
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ListFilters
            search={searchInput}
            category={filters.category}
            sortBy={filters.sortBy}
            onSearchChange={setSearchInput}
            onCategoryChange={(value) => updateUrl({ category: value, page: 1 })}
            onSortChange={(value) => updateUrl({ sortBy: value })}
            onReset={() => {
              setSearchInput('');
              updateUrl({ search: '', category: 'all', sortBy: 'price-asc', page: 1 });
            }}
            isLoading={isPending}
          />
        </div>

        {/* Results count */}
        {searchInput && (
          <div className="mb-6 text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{total}</span> product{total !== 1 ? 's' : ''} matching &quot;{searchInput}&quot;
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => canPrevious && updateUrl({ page: filters.page - 1 })}
                        className={canPrevious ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                        aria-disabled={!canPrevious}
                      />
                    </PaginationItem>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const isCurrentPage = page === filters.page;
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= filters.page - 1 && page <= filters.page + 1);

                      if (!showPage && page !== 2 && page !== totalPages - 1) {
                        return null;
                      }

                      if (!showPage) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => updateUrl({ page })}
                            isActive={isCurrentPage}
                            className={isCurrentPage ? '' : 'cursor-pointer'}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => canNext && updateUrl({ page: filters.page + 1 })}
                        className={canNext ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                        aria-disabled={!canNext}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <ListEmptyState />
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <ListSkeleton count={ITEMS_PER_PAGE} />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
