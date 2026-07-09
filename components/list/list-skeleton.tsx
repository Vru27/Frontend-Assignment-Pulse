import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

export function ListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-48">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-48">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* List items skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ListErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardDescription className="text-destructive">
          Error loading products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </CardContent>
    </Card>
  );
}

export function ListEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 size-12 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="size-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </CardContent>
    </Card>
  );
}
