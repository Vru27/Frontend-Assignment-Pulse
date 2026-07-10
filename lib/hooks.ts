import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  getAllCategories,
  getAllProducts,
  calculateDashboardStats,
  getCategoryStats,
  getPriceDistribution,
} from './api';
import { Product, ProductsResponse, DashboardStats, CategoryStats, Category } from './types';

export function useProducts(
  skip: number,
  limit: number,
  searchTerm?: string,
  category?: string
): UseQueryResult<ProductsResponse> {
  return useQuery({
    queryKey: ['products', skip, limit, searchTerm, category],
    queryFn: () => getProducts(skip, limit, searchTerm, category),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProductDetail(id: number | null): UseQueryResult<Product> {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => (id ? getProductById(id) : Promise.reject(new Error('No ID provided'))),
    enabled: id !== null && id !== undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useCategories(): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

export function useDashboardData(): UseQueryResult<{
  stats: DashboardStats;
  categoryStats: CategoryStats[];
  priceDistribution: Array<{ range: string; count: number }>;
}> {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const allProducts = await getAllProducts();
      return {
        stats: calculateDashboardStats(allProducts),
        categoryStats: getCategoryStats(allProducts),
        priceDistribution: getPriceDistribution(allProducts),
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
