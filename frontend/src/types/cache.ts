export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastUpdated: Date;
  version: string;
  shop: string;
}

export interface CardLoadingState {
  revenue: boolean;
  products: boolean;
  inventory: boolean;
  newProducts: boolean;
  insights: boolean;
  orders: boolean;
  abandonedCarts: boolean;
}

export interface CardErrorState {
  revenue: string | null;
  products: string | null;
  inventory: string | null;
  newProducts: string | null;
  insights: string | null;
  orders: string | null;
  abandonedCarts: string | null;
}

export interface DashboardCache {
  version: string;
  shop: string;
  revenue?: CacheEntry<any>;
  products?: CacheEntry<any>;
  inventory?: CacheEntry<any>;
  newProducts?: CacheEntry<any>;
  abandonedCarts?: CacheEntry<any>;
  orders?: CacheEntry<any>;
  insights?: CacheEntry<any>;
}