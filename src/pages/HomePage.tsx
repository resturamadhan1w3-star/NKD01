import React from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { HeroBannerSlider } from '../components/home/HeroBannerSlider.tsx';
import { ContentRow } from '../components/home/ContentRow.tsx';
import { Movie, Video, Banner } from '../types/index.ts';
import {
  Skull,
  Radio,
  Youtube,
  Instagram,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, slug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { banners, movies, videos, articles, shorts, reels, watchHistory, openPlayer } = useStreaming();

  const handlePlayBanner = (banner: Banner) => {
    // If banner matches a movie or video, play directly; otherwise navigate
    const matchedMovie = movies.find((m) => m.title.toLowerCase() === banner.title.toLowerCase());
    if (matchedMovie) {
      openPlayer('movie', matchedMovie);
      return;
    }
    const matchedVideo = videos.find((v) => v.title.toLowerCase() === banner.title.toLowerCase());
    if (matchedVideo) {
      openPlayer('video', matchedVideo);
      return;
    }
    if (movies.length > 0) {
      openPlayer('movie', movies[0]);
    }
  };

  const handleSelectMedia = (item: Movie | Video) => {
    if ('synopsis' in item) {
      openPlayer('movie', item);
    } else {
      openPlayer('video', item);
    }
  };

  // Filter sections
  const trendingVideos = videos.filter((v) => !v.isShort && v.isTrending);
  const conspiracyVideos = videos.filter((v) => !v.isShort && v.categorySlug === 'konspirasi');
  const horrorVideos = videos.filter((v) => !v.isShort && v.categorySlug === 'horor');
  const mysteryVideos = videos.filter((v) => !v.isShort && v.categorySlug === 'misteri');

  return (
    <div className="min-h-screen pb-16">
      {/* Dynamic Hero Banner Slider */}
      <HeroBannerSlider banners={banners} onPlayBanner={handlePlayBanner} onNavigate={onNavigate} />

      {/* Main Streaming Rows */}
      <div className="space-y-4 md:space-y-8 -mt-6 sm:-mt-10 relative z-30">
        {/* Continue Watching (If history exists) */}
        {watchHistory.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-[#39FF14]" />
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                Lanjutkan Menonton
              </h2>
            </div>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none">
              {watchHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const matched =
                      item.contentType === 'movie'
                        ? movies.find((m) => m.id === item.contentId)
                        : videos.find((v) => v.id === item.contentId);
                    if (matched) handleSelectMedia(matched);
                  }}
                  className="flex-none w-52 sm:w-64 rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    {/* Progress Bar indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-[#39FF14]"
                        style={{
                          width: `${Math.min(
                            100,
                            (item.progressSeconds / (item.durationSeconds || item.progressSeconds || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-white font-medium truncate">{item.title}</p>
                    <p className="text-[10px] text-[#8A968D] font-mono mt-0.5">
                      Tersisa {Math.max(0, Math.floor(((item.durationSeconds || 600) - item.progressSeconds) / 60))} menit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Mystery Row */}
        <ContentRow
          title="Trending Mystery & Investigasi"
          subtitle="Tayangan yang paling banyak diperbincangkan pekan ini"
          type="video"
          items={trendingVideos.length > 0 ? trendingVideos : videos.slice(0, 6)}
          onSelect={handleSelectMedia}
          onViewAll={() => onNavigate('misteri')}
        />

        {/* Latest Movies Row */}
        <ContentRow
          title="Film & Sinema Thriller"
          subtitle="Koleksi film horor psikologis dan thriller kriminal pilihan"
          type="movie"
          items={movies}
          onSelect={handleSelectMedia}
          onViewAll={() => onNavigate('film')}
        />

        {/* Dark Shorts Row */}
        <ContentRow
          title="Dark Shorts (Format 9:16)"
          subtitle="Arsip rekaman anomali dan teori cepat dalam format vertikal"
          type="short"
          items={shorts}
          onSelect={handleSelectMedia}
          onViewAll={() => onNavigate('shorts')}
        />

        {/* Konspirasi Pilihan Row */}
        <ContentRow
          title="Konspirasi & Arsip Rahasia Global"
          subtitle="Eksperimen intelijen, dokumen deklasifikasi, dan organisasi bayangan"
          type="video"
          items={conspiracyVideos.length > 0 ? conspiracyVideos : videos.slice(0, 6)}
          onSelect={handleSelectMedia}
          onViewAll={() => onNavigate('konspirasi')}
        />

        {/* Horror Zone Row */}
        <ContentRow
          title="Zona Horor & Urban Legend"
          subtitle="Kisah nyata pesugihan, kutukan kuno, dan rekaman entitas astral"
          type="video"
          items={horrorVideos.length > 0 ? horrorVideos : videos.slice(0, 6)}
          onSelect={handleSelectMedia}
          onViewAll={() => onNavigate('horor')}
        />

        {/* YouTube Channel Sync Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#09251A] via-[#0A100D] to-[#050706] border border-[#39FF14]/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/50 text-red-400 text-xs font-mono font-bold">
                <Youtube className="h-4 w-4 text-red-500 fill-current" />
                YOUTUBE CHANNEL SYNC RESMI
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Saluran YouTube NGOBROL DI KANTOR
              </h3>
              <p className="text-xs sm:text-sm text-[#8A968D] max-w-xl">
                Seluruh video investigasi dan podcast misteri disinkronkan secara otomatis dari saluran YouTube resmi melalui integrasi YouTube Data API v3.
              </p>
            </div>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider transition shadow-lg shrink-0 cursor-pointer"
            >
              <Youtube className="h-4 w-4 fill-current" />
              <span>Subscribe Channel</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Instagram Reels Showcase */}
        {reels.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-500" />
                <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                  Instagram Reels & Anomali
                </h2>
              </div>
              <span className="text-xs text-[#8A968D]">@ngobroldikantor.id</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {reels.slice(0, 4).map((reel) => (
                <div
                  key={reel.id}
                  className="rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition group"
                >
                  <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                    <img
                      src={reel.thumbnailUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <p className="text-xs font-medium text-white line-clamp-2">{reel.title}</p>
                      {reel.caption && (
                        <p className="text-[10px] text-[#8A968D] line-clamp-1 mt-0.5">{reel.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest Investigative Articles / News */}
        {articles.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#39FF14]" />
                <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                  Warta Investigasi Terkini
                </h2>
              </div>
              <button
                onClick={() => onNavigate('berita')}
                className="text-xs text-[#39FF14] hover:text-[#8AFF68] font-mono tracking-wider transition flex items-center gap-1 cursor-pointer"
              >
                <span>Portal Berita</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.slice(0, 3).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigate('berita', art.slug)}
                  className="rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 p-4 transition-all hover:scale-[1.01] cursor-pointer space-y-3 group"
                >
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <img
                      src={art.thumbnailUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-mono uppercase bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40 px-2 py-0.5 rounded font-bold">
                      {art.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white line-clamp-2 group-hover:text-[#39FF14] transition">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#8A968D] line-clamp-2 mt-1 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8A968D] font-mono pt-2 border-t border-white/5">
                    <span>Oleh: {art.author}</span>
                    <span>{art.viewsCount} Baca</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
