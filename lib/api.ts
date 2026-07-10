import { Product, ProductsResponse, FilterParams, DashboardStats, CategoryStats } from './types';

const API_BASE = 'https://dummyjson.com/products';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Cache for storing API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();

async function fetchWithCache(url: string, options?: RequestInit) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProducts(
  skip: number = 0,
  limit: number = 10,
  searchTerm?: string,
  category?: string
): Promise<ProductsResponse> {
  try {
    let url: string;

    if (category && category !== 'all') {
      url = `${API_BASE}/category/${category}?skip=${skip}&limit=${limit}`;
    } else {
      url = `${API_BASE}?skip=${skip}&limit=${limit}`;
    }

    if (searchTerm && searchTerm.trim()) {
      const searchUrl = `${API_BASE}?skip=0&limit=194`;
      const allData = await fetchWithCache(searchUrl);

      const filtered = allData.products.filter((p: Product) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      let result = filtered;
      if (category && category !== 'all') {
        result = filtered.filter((p: Product) => p.category === category);
      }

      const paginatedResults = result.slice(skip, skip + limit);
      return {
        products: paginatedResults,
        total: result.length,
        skip,
        limit,
      };
    }

    if (category && category !== 'all') {
      url += `&category=${category}`;
    }

    const data: ProductsResponse = await fetchWithCache(url);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    const data = await fetchWithCache(`${API_BASE}/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product with id ${id}`);
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await fetchWithCache(`${API_BASE}/categories`);
    return Array.isArray(categories) ? categories : [];
  } catch {
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data: ProductsResponse = await fetchWithCache(`${API_BASE}?limit=194`);
    return data.products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw new Error('Failed to fetch all products');
  }
}

export function calculateDashboardStats(products: Product[]): DashboardStats {
  if (!products.length) {
    return {
      totalProducts: 0,
      averagePrice: 0,
      priceRange: { min: 0, max: 0 },
      averageRating: 0,
      topRatedProduct: null,
    };
  }

  const prices = products.map((p) => p.price);
  const ratings = products.map((p) => p.rating);

  return {
    totalProducts: products.length,
    averagePrice: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    averageRating: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100) / 100,
    topRatedProduct: products.reduce((max, p) => (p.rating > (max?.rating || 0) ? p : max), products[0]),
  };
}

export function getCategoryStats(products: Product[]): CategoryStats[] {
  const statsMap = new Map<string, { count: number; prices: number[]; ratings: number[] }>();

  products.forEach((product) => {
    if (!statsMap.has(product.category)) {
      statsMap.set(product.category, { count: 0, prices: [], ratings: [] });
    }

    const stats = statsMap.get(product.category)!;
    stats.count++;
    stats.prices.push(product.price);
    stats.ratings.push(product.rating);
  });

  return Array.from(statsMap.entries()).map(([category, stats]) => ({
    category,
    count: stats.count,
    avgPrice: Math.round((stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length) * 100) / 100,
    avgRating: Math.round((stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length) * 100) / 100,
  }));
}

export function getPriceDistribution(products: Product[], binSize: number = 100) {
  const bins: { range: string; count: number }[] = [];
  const prices = products.map((p) => p.price).sort((a, b) => a - b);

  if (prices.length === 0) return bins;

  const minPrice = Math.floor(prices[0] / binSize) * binSize;
  const maxPrice = Math.ceil(prices[prices.length - 1] / binSize) * binSize;

  for (let i = minPrice; i < maxPrice; i += binSize) {
    const count = prices.filter((p) => p >= i && p < i + binSize).length;
    bins.push({ range: `$${i}-$${i + binSize}`, count });
  }

  return bins;
}
