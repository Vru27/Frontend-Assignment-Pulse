import { FilterParams } from './types';

// Parse URL query parameters into FilterParams
export function parseFilterParams(searchParams: URLSearchParams): FilterParams {
  return {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    sortBy: (searchParams.get('sortBy') as any) || 'price-asc',
    page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
  };
}

// Convert FilterParams to URL query string
export function stringifyFilterParams(params: FilterParams): string {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.sortBy && params.sortBy !== 'price-asc') query.set('sortBy', params.sortBy);
  if (params.page && params.page > 1) query.set('page', String(params.page));
  return query.toString();
}

// Format currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

// Format rating with stars
export function formatRating(rating: number): string {
  const stars = Math.round(rating);
  return `${rating.toFixed(1)} ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Format stock status
export function formatStockStatus(stock: number): { text: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' } {
  if (stock === 0) {
    return { text: 'Out of Stock', variant: 'destructive' };
  } else if (stock < 10) {
    return { text: `Low Stock (${stock})`, variant: 'outline' };
  }
  return { text: 'In Stock', variant: 'default' };
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Capitalize string
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate discount price
export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return Math.round((price * (1 - discountPercentage / 100)) * 100) / 100;
}

// Sort products
export function sortProducts(
  products: any[],
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc'
): any[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}
