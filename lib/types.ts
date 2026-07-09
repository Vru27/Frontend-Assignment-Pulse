// Product and query types for Pulse dashboard

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface FilterParams {
  search: string;
  category: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';
  page: number;
}

export interface DashboardStats {
  totalProducts: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  averageRating: number;
  topRatedProduct: Product | null;
}

export interface CategoryStats {
  category: string;
  count: number;
  avgPrice: number;
  avgRating: number;
}
