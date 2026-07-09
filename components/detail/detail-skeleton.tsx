import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* Image */}
      <div className="md:col-span-2">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>

      {/* Info */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description */}
      <div className="md:col-span-3">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function DetailErrorState({
  error,
  onRetry,
  onBack,
}: {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <h2 className="text-lg font-semibold text-destructive">Unable to load product</h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
          <button
            onClick={onBack}
            className="text-sm font-medium text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DetailNotFound({ onBack }: { onBack: () => void }) {
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Product not found
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={onBack}
          className="text-sm font-medium text-primary hover:underline"
        >
          Go back to products
        </button>
      </CardContent>
    </Card>
  );
}
