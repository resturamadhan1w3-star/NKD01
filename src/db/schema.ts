import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or local user ID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('user'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('superadmin'),
  mustChangePassword: boolean('must_change_password').notNull().default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const websiteSettings = pgTable('website_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description').notNull(),
  category: text('category').notNull().default('Misteri'),
  desktopImageUrl: text('desktop_image_url').notNull(),
  mobileImageUrl: text('mobile_image_url').notNull(),
  buttonText: text('button_text').notNull().default('Tonton Sekarang'),
  targetUrl: text('target_url').notNull().default('/film'),
  focalPoint: text('focal_point').notNull().default('center'),
  gradientOverlay: text('gradient_overlay').notNull().default('dark-cinematic'),
  slideDuration: integer('slide_duration').notNull().default(6000),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('Eye'),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  categorySlug: text('category_slug').notNull().default('misteri'),
  videoType: text('video_type').notNull().default('youtube'), // 'youtube' | 'html5' | 'embed'
  videoUrl: text('video_url').notNull(),
  youtubeVideoId: text('youtube_video_id'),
  thumbnailUrl: text('thumbnail_url').notNull(),
  duration: text('duration').notNull().default('15:00'),
  viewsCount: integer('views_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isTrending: boolean('is_trending').notNull().default(false),
  isShort: boolean('is_short').notNull().default(false),
  status: text('status').notNull().default('published'), // 'draft' | 'review' | 'published'
  publishDate: timestamp('publish_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  synopsis: text('synopsis').notNull(),
  genre: text('genre').notNull().default('Horor'),
  releaseYear: integer('release_year').notNull().default(2024),
  durationMinutes: integer('duration_minutes').notNull().default(90),
  ageRating: text('age_rating').notNull().default('18+'),
  posterUrl: text('poster_url').notNull(),
  bannerUrl: text('banner_url').notNull(),
  videoUrl: text('video_url').notNull(),
  trailerUrl: text('trailer_url'),
  castList: text('cast_list'),
  director: text('director'),
  isEditorChoice: boolean('is_editor_choice').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false),
  viewsCount: integer('views_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull().default('Misteri'),
  author: text('author').notNull().default('Tim Redaksi'),
  thumbnailUrl: text('thumbnail_url').notNull(),
  tags: text('tags').notNull().default('konspirasi,misteri'),
  isHeadline: boolean('is_headline').notNull().default(false),
  isEditorChoice: boolean('is_editor_choice').notNull().default(false),
  status: text('status').notNull().default('published'), // 'draft' | 'review' | 'published'
  viewsCount: integer('views_count').notNull().default(0),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const youtubeChannels = pgTable('youtube_channels', {
  id: serial('id').primaryKey(),
  channelName: text('channel_name').notNull(),
  channelUrl: text('channel_url').notNull(),
  channelId: text('channel_id').notNull(),
  category: text('category').notNull().default('misteri'),
  autoSync: boolean('auto_sync').notNull().default(true),
  autoPublish: text('auto_publish').notNull().default('auto'), // 'auto' | 'review' | 'disabled'
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const youtubeSyncLogs = pgTable('youtube_sync_logs', {
  id: serial('id').primaryKey(),
  channelId: text('channel_id').notNull(),
  status: text('status').notNull(),
  videosFound: integer('videos_found').notNull().default(0),
  videosImported: integer('videos_imported').notNull().default(0),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const instagramAccounts = pgTable('instagram_accounts', {
  id: serial('id').primaryKey(),
  accountName: text('account_name').notNull(),
  profileUrl: text('profile_url').notNull(),
  category: text('category').notNull().default('dark_shorts'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const instagramMedia = pgTable('instagram_media', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id'),
  title: text('title').notNull(),
  reelUrl: text('reel_url').notNull(),
  embedHtml: text('embed_html'),
  caption: text('caption'),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').notNull().default('dark_shorts'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mediaLibrary = pgTable('media_library', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull().default('image'),
  fileSize: integer('file_size').notNull().default(0),
  folder: text('folder').notNull().default('general'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const watchHistory = pgTable('watch_history', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  contentType: text('content_type').notNull(), // 'video' | 'movie' | 'short'
  contentId: integer('content_id').notNull(),
  title: text('title').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  progressSeconds: integer('progress_seconds').notNull().default(0),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  contentType: text('content_type').notNull(), // 'video' | 'movie' | 'article'
  contentId: integer('content_id').notNull(),
  title: text('title').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  category: text('category').notNull().default('General'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const playlists = pgTable('playlists', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  adminUsername: text('admin_username').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ageVerificationRecords = pgTable('age_verification_records', {
  id: serial('id').primaryKey(),
  sessionToken: text('session_token').notNull(),
  isVerified: boolean('is_verified').notNull().default(true),
  verifiedAt: timestamp('verified_at').defaultNow(),
});
