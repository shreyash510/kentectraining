import {executeSql, getDatabase} from './database';
import type {HomePageResponse} from '../types';

// Initialize cache tables
export const initCacheDatabase = async (): Promise<void> => {
  await getDatabase();
  await executeSql(`
    CREATE TABLE IF NOT EXISTS content_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cache_key TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Cache keys
export const CACHE_KEYS = {
  HOME_PAGE: 'home_page',
} as const;

// Save home page data to cache
export const saveHomePageToCache = async (
  data: HomePageResponse,
): Promise<void> => {
  const jsonContent = JSON.stringify(data);
  await executeSql(
    `INSERT INTO content_cache (cache_key, content, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(cache_key)
     DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`,
    [CACHE_KEYS.HOME_PAGE, jsonContent],
  );
};

// Get home page data from cache
export const getHomePageFromCache = async (): Promise<HomePageResponse | null> => {
  const result = await executeSql(
    'SELECT content FROM content_cache WHERE cache_key = ?',
    [CACHE_KEYS.HOME_PAGE],
  );

  if (result.rows.length > 0) {
    const row = result.rows.item(0);
    return JSON.parse(row.content) as HomePageResponse;
  }
  return null;
};

// Check if cache exists and is fresh (within maxAge in milliseconds)
export const isCacheFresh = async (
  cacheKey: string,
  maxAgeMs: number = 24 * 60 * 60 * 1000, // Default 24 hours
): Promise<boolean> => {
  const result = await executeSql(
    'SELECT updated_at FROM content_cache WHERE cache_key = ?',
    [cacheKey],
  );

  if (result.rows.length === 0) {
    return false;
  }

  const updatedAt = new Date(result.rows.item(0).updated_at).getTime();
  const now = Date.now();
  return now - updatedAt < maxAgeMs;
};

// Clear specific cache
export const clearCache = async (cacheKey: string): Promise<void> => {
  await executeSql('DELETE FROM content_cache WHERE cache_key = ?', [cacheKey]);
};

// Clear all cache
export const clearAllCache = async (): Promise<void> => {
  await executeSql('DELETE FROM content_cache');
};

// Get cache info
export const getCacheInfo = async (
  cacheKey: string,
): Promise<{exists: boolean; updatedAt: string | null}> => {
  const result = await executeSql(
    'SELECT updated_at FROM content_cache WHERE cache_key = ?',
    [cacheKey],
  );

  if (result.rows.length > 0) {
    return {
      exists: true,
      updatedAt: result.rows.item(0).updated_at,
    };
  }
  return {exists: false, updatedAt: null};
};
