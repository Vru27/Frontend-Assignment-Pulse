import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { formatPrice } from '@/lib/utils-custom';
import { TrendingUp, DollarSign, Package, Star } from 'lucide-react';

interface KPICardsProps {
  stats: DashboardStats;
}

export function KPICards({ stats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">Products in inventory</p>
        </CardContent>
      </Card>

      {/* Average Price */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats.averagePrice)}</div>
          <p className="text-xs text-muted-foreground">Mean product price</p>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(stats.priceRange.min)} - {formatPrice(stats.priceRange.max)}
          </div>
          <p className="text-xs text-muted-foreground">Min - Max prices</p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="size-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Out of 5 stars</p>
        </CardContent>
      </Card>
    </div>
  );
}
