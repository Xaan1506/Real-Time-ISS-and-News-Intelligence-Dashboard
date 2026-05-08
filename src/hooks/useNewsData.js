import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDashboardStore } from '../context/useDashboardStore';
import { fetchNews } from '../services/newsService';
import { NEWS_CACHE_KEY, NEWS_CACHE_TTL_MS } from '../utils/constants';
import { setCache } from '../utils/cache';

export function useNewsData() {
  const { setNewsData, setNewsCache } = useDashboardStore();

  const refreshNews = useCallback(
    async (category = '') => {
      try {
        setNewsData({ isLoadingNews: true, newsError: null });
        const newsArticles = await fetchNews(category);
        const cache = { data: newsArticles, updatedAt: Date.now(), category };
        setCache(NEWS_CACHE_KEY, cache);
        setNewsData({ newsArticles, isLoadingNews: false, newsError: null });
        setNewsCache(cache);
        toast.success('News refreshed');
      } catch {
        setNewsData({ isLoadingNews: false, newsError: 'Failed to load news feed. Please retry.' });
        toast.error('Failed to load news feed');
      }
    },
    [setNewsData, setNewsCache],
  );

  useEffect(() => {
    const cached = useDashboardStore.getState().newsCache;
    const expired = !cached || Date.now() - cached.updatedAt > NEWS_CACHE_TTL_MS;
    if (expired) {
      refreshNews();
      return;
    }
    setNewsData({ newsArticles: cached.data });
  }, [refreshNews, setNewsData]);

  return { refreshNews };
}
