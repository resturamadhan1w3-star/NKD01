export interface WebsiteSettings {
  site_name: string;
  tagline: string;
  concept: string;
  primary_color: string;
  accent_color: string;
  logo_text: string;
  logo_url?: string;
  contact_email: string;
  age_gate_enabled: string;
  about_content: string;
  privacy_policy: string;
  terms_of_service: string;
  [key: string]: string | undefined;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  category: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  buttonText: string;
  targetUrl: string;
  focalPoint: string;
  gradientOverlay: string;
  slideDuration: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
  videoType: 'youtube' | 'html5' | 'embed';
  videoUrl: string;
  youtubeVideoId?: string | null;
  thumbnailUrl: string;
  duration: string;
  viewsCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isShort: boolean;
  status: 'draft' | 'review' | 'published';
  publishDate?: string;
  createdAt?: string;
}

export interface Movie {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  genre: string;
  releaseYear: number;
  durationMinutes: number;
  ageRating: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  trailerUrl?: string | null;
  castList?: string | null;
  director?: string | null;
  isEditorChoice: boolean;
  isFeatured: boolean;
  viewsCount: number;
  createdAt?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  thumbnailUrl: string;
  tags: string;
  isHeadline: boolean;
  isEditorChoice: boolean;
  status: 'draft' | 'review' | 'published';
  viewsCount: number;
  publishedAt: string;
  createdAt?: string;
}

export interface InstagramMedia {
  id: number;
  accountId?: number | null;
  title: string;
  reelUrl: string;
  embedHtml?: string | null;
  caption?: string | null;
  thumbnailUrl?: string | null;
  category: string;
  isPublished: boolean;
  createdAt?: string;
}

export interface YouTubeChannel {
  id: number;
  channelName: string;
  channelUrl: string;
  channelId: string;
  category: string;
  autoSync: boolean;
  autoPublish: 'auto' | 'review' | 'disabled';
  lastSyncedAt?: string | null;
  createdAt?: string;
}

export interface YouTubeSyncLog {
  id: number;
  channelId: string;
  status: string;
  videosFound: number;
  videosImported: number;
  message?: string | null;
  createdAt: string;
}

export interface WatchHistoryItem {
  id: number;
  userId: string;
  contentType: 'video' | 'movie' | 'short';
  contentId: number;
  title: string;
  thumbnailUrl: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}

export interface FavoriteItem {
  id: number;
  userId: string;
  contentType: 'video' | 'movie' | 'article';
  contentId: number;
  title: string;
  thumbnailUrl: string;
  category: string;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  adminUsername: string;
  action: string;
  targetType: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string;
  mustChangePassword: boolean;
}
