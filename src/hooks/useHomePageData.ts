import {useState, useEffect} from 'react';
import type {HomePageResponse} from '../types';
import {
  initCacheDatabase,
  getHomePageFromCache,
  saveHomePageToCache,
} from '../services/cacheService';
import localData from '../docs/document.json';

export const useHomePageData = () => {
  const [data, setData] = useState<HomePageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize database
        await initCacheDatabase();

        // Try to get from cache first
        let homeData = await getHomePageFromCache();

        // If no cache, use local JSON and save to cache
        if (!homeData) {
          homeData = localData as HomePageResponse;
          await saveHomePageToCache(homeData);
        }

        setData(homeData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to local data
        setData(localData as HomePageResponse);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {data, loading};
};

export default useHomePageData;
