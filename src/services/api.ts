import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Simple in-memory Cache for static/slow-changing resources
const cacheMap = new Map<string, { data: any; expiry: number }>();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Cache Helper
export async function getCachedOrFetch<T>(
  url: string,
  config?: AxiosRequestConfig,
  ttlMs = DEFAULT_CACHE_TTL
): Promise<T> {
  const cacheKey = `${url}?${JSON.stringify(config?.params || {})}`;
  const cached = cacheMap.get(cacheKey);

  if (cached && Date.now() < cached.expiry) {
    return cached.data as T;
  }

  const response = await apiClient.get<T>(url, config);
  cacheMap.set(cacheKey, {
    data: response.data,
    expiry: Date.now() + ttlMs,
  });

  return response.data;
}

export function clearApiCache() {
  cacheMap.clear();
}
