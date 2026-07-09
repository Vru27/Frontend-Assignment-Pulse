'use client';

import { Suspense, ReactNode } from 'react';
import { useDashboardData } from '@/lib/hooks';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { CategoryChart, PriceDistributionChart } from '@/components/dashboard/charts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

function DashboardContent() {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* KPI Skeletons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Skeletons */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Failed to load dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error?.message || 'An error occurred while loading dashboard data.'}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics and insights across {data.stats.totalProducts} products
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards stats={data.stats} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryChart data={data.categoryStats} />
          <PriceDistributionChart data={data.priceDistribution} />
        </div>

        {data.stats.topRatedProduct && (
          <div className="mt-6">
            <Card>
              <div className="flex flex-col md:flex-row gap-4 p-6">
                <div className="md:w-24 md:h-24 w-full h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={data.stats.topRatedProduct.thumbnail}
                    alt={data.stats.topRatedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Top Rated Product</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {data.stats.topRatedProduct.title}
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-lg font-bold">{data.stats.topRatedProduct.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ 5.0</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {data.stats.topRatedProduct.reviews?.length || 0} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="px-4 py-8 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
