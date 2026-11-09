import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Banner, Category, Movie, Video, Article, InstagramMedia, WebsiteSettings, WatchHistoryItem, FavoriteItem } from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

interface ActiveMediaState {
  type: 'video' | 'movie';
  item: Video | Movie;
}

interface StreamingContextType {
  settings: WebsiteSettings;
  banners: Banner[];
  categories: Category[];
  movies: Movie[];
  videos: Video[];
  articles: Article[];
  shorts: Video[];
  reels: InstagramMedia[];
  loading: boolean;
  refreshData: () => Promise<void>;

  // Video Streaming Player
  activeMedia: ActiveMediaState | null;
  openPlayer: (type: 'video' | 'movie', item: Video | Movie) => void;
  closePlayer: () => void;
  recordWatchProgress: (progressSeconds: number, durationSeconds: number) => void;

  // Favorites & History
  watchHistory: WatchHistoryItem[];
  favorites: FavoriteItem[];
  toggleFavorite: (contentType: 'video' | 'movie' | 'article', contentId: number, title: string, thumbnailUrl: string, category: string) => Promise<boolean>;
  isFavorited: (contentType: string, contentId: number) => boolean;
}

const defaultSettings: WebsiteSettings = {
  site_name: 'NGOBROL DI KANTOR',
  tagline: 'THE DARK SIDE OF EVERY STORY.',
  concept: 'Digital Mystery & Dark Entertainment Platform',
  primary_color: '#050706',
  accent_color: '#39FF14',
  logo_text: 'NGOBROL DI KANTOR',
  contact_email: 'redaksi@ngobroldikantor.com',
  age_gate_enabled: 'true',
  about_content: '',
  privacy_policy: '',
  terms_of_service: '',
};

const StreamingContext = createContext<StreamingContextType | undefined>(undefined);

export const StreamingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { guestId } = useAuth();
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [shorts, setShorts] = useState<Video[]>([]);
  const [reels, setReels] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Player State
  const [activeMedia, setActiveMedia] = useState<ActiveMediaState | null>(null);

  // User Data State
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/initial-data');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
        if (data.banners) setBanners(data.banners);
        if (data.categories) setCategories(data.categories);
        if (data.featuredMovies) setMovies(data.featuredMovies);
        if (data.trendingVideos) setVideos(data.trendingVideos);
        if (data.darkShorts) setShorts(data.darkShorts);
        if (data.headlines) setArticles(data.headlines);
      }

      // Also fetch reels in background
      fetch('/api/public/reels')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setReels(data);
        })
        .catch(() => {});
    } catch (err) {
      console.error('Failed to load streaming data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async (uid: string) => {
    if (!uid) return;
    try {
      const res = await fetch(`/api/public/user/${uid}/data`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) setWatchHistory(data.history);
        if (data.favorites) setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (guestId) {
      fetchUserData(guestId);
    }
  }, [guestId, fetchUserData]);

  const openPlayer = (type: 'video' | 'movie', item: Video | Movie) => {
    setActiveMedia({ type, item });
  };

  const closePlayer = () => {
    setActiveMedia(null);
  };

  const recordWatchProgress = async (progressSeconds: number, durationSeconds: number) => {
    if (!activeMedia || !guestId) return;
    try {
      await fetch('/api/public/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: guestId,
          contentType: activeMedia.type,
          contentId: activeMedia.item.id,
          title: activeMedia.item.title,
          thumbnailUrl: 'thumbnailUrl' in activeMedia.item ? activeMedia.item.thumbnailUrl : activeMedia.item.posterUrl,
          progressSeconds,
          durationSeconds,
        }),
      });
      // Refresh user history
      fetchUserData(guestId);
    } catch (err) {
      console.error('Failed to record watch history:', err);
    }
  };

  const toggleFavorite = async (
    contentType: 'video' | 'movie' | 'article',
    contentId: number,
    title: string,
    thumbnailUrl: string,
    category: string
  ): Promise<boolean> => {
    if (!guestId) return false;
    try {
      const res = await fetch('/api/public/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: guestId,
          contentType,
          contentId,
          title,
          thumbnailUrl,
          category,
        }),
      });
      const data = await res.json();
      fetchUserData(guestId);
      return data.favorited;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      return false;
    }
  };

  const isFavorited = (contentType: string, contentId: number) => {
    return favorites.some((f) => f.contentType === contentType && f.contentId === contentId);
  };

  return (
    <StreamingContext.Provider
      value={{
        settings,
        banners,
        categories,
        movies,
        videos,
        articles,
        shorts,
        reels,
        loading,
        refreshData: fetchData,
        activeMedia,
        openPlayer,
        closePlayer,
        recordWatchProgress,
        watchHistory,
        favorites,
        toggleFavorite,
        isFavorited,
      }}
    >
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) throw new Error('useStreaming must be used within a StreamingProvider');
  return context;
};
