import { create } from 'zustand';
import { CHAT_CACHE_KEY, NEWS_CACHE_KEY, THEME_KEY } from '../utils/constants';
import { getCache, setCache } from '../utils/cache';

const chatCache = getCache(CHAT_CACHE_KEY) || [];

export const useDashboardStore = create((set) => ({
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  issPositions: [],
  speedHistory: [],
  currentSpeed: 0,
  nearestPlace: 'Loading...',
  peopleInSpace: { number: 0, people: [] },
  newsCache: getCache(NEWS_CACHE_KEY),
  newsArticles: [],
  categoryFilter: 'all',
  searchTerm: '',
  sortBy: 'latest',
  autoRefresh: true,
  isLoadingISS: false,
  isLoadingNews: false,
  newsError: null,
  issError: null,
  isAskingAI: false,
  chatMessages: chatCache,
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  },
  setISSData: (payload) => set((state) => (typeof payload === 'function' ? payload(state) : payload)),
  setNewsData: (payload) => set((state) => (typeof payload === 'function' ? payload(state) : payload)),
  setNewsCache: (newsCache) => set({ newsCache }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSortBy: (sortBy) => set({ sortBy }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
  setAskingAI: (isAskingAI) => set({ isAskingAI }),
  addChatMessage: (message) =>
    set((state) => {
      const next = [...state.chatMessages, message].slice(-30);
      setCache(CHAT_CACHE_KEY, next);
      return { chatMessages: next };
    }),
  clearChat: () => {
    setCache(CHAT_CACHE_KEY, []);
    set({ chatMessages: [] });
  },
}));
