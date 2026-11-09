export interface ParsedCopasItem {
  originalUrl: string;
  platform: 'youtube' | 'youtube_short' | 'instagram' | 'direct' | 'other';
  videoId?: string;
  isShort: boolean;
  aspectRatio: '9:16' | '16:9';
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  categorySlug: string;
  duration: string;
}

export function parseCopasUrl(rawUrl: string, customTitle?: string, customCategory?: string): ParsedCopasItem {
  const url = rawUrl.trim();
  let platform: ParsedCopasItem['platform'] = 'other';
  let videoId: string | undefined = undefined;
  let isShort = false;
  let videoUrl = url;
  let thumbnailUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
  let title = customTitle || '';
  let description = 'Investigasi digital yang diimpor melalui CMS Ngobrol Di Kantor Copas Engine.';
  let categorySlug = customCategory || 'misteri';
  let duration = '10:00';

  // 1. YouTube Shorts: https://www.youtube.com/shorts/{id}
  if (url.includes('youtube.com/shorts/')) {
    platform = 'youtube_short';
    isShort = true;
    const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (match) videoId = match[1];
  }
  // 2. YouTube Standard: watch?v={id} or youtu.be/{id}
  else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube';
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})/);
    if (match) videoId = match[1];
  }
  // 3. Instagram Reels: instagram.com/reel/{id}
  else if (url.includes('instagram.com/reel/')) {
    platform = 'instagram';
    isShort = true;
    thumbnailUrl = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80';
    duration = '0:50';
  }
  // 4. Direct video files (MP4, WebM, etc.)
  else if (/\.(mp4|webm|mkv|m3u8)(\?.*)?$/i.test(url)) {
    platform = 'direct';
    thumbnailUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
    duration = '12:30';
  }

  // Generate thumbnail and normalized videoUrl for YouTube
  if (videoId) {
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!title) {
      title = isShort ? `Dark Short #${videoId.slice(0, 6)}` : `Kasus Investigasi [ID: ${videoId}]`;
    }
    if (isShort) {
      categorySlug = 'dark-shorts';
      duration = '0:55';
    }
  }

  if (!title) {
    title = isShort ? 'Dark Short Misteri' : 'Dokumentasi Tersembunyi';
  }

  return {
    originalUrl: url,
    platform,
    videoId,
    isShort,
    aspectRatio: isShort ? '9:16' : '16:9',
    videoUrl,
    thumbnailUrl,
    title,
    description,
    categorySlug,
    duration,
  };
}

export function parseBulkCopasUrls(rawText: string, defaultCategory: string = 'misteri'): ParsedCopasItem[] {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 5 && (l.startsWith('http://') || l.startsWith('https://')));

  return lines.map((url, index) => {
    return parseCopasUrl(url, undefined, defaultCategory);
  });
}
