import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { Video, Movie } from '../types/index.ts';
import { Compass, ShieldAlert, Skull, FileText, Play, Eye, Clock, Search } from 'lucide-react';

interface CategoryContentPageProps {
  categoryType: 'misteri' | 'konspirasi' | 'horor' | 'dokumenter';
}

const configMap = {
  misteri: {
    title: 'Misteri Dunia & Fenomena Tak Terjelaskan',
    subtitle: 'Misteri sejarah kuno, peradaban hilang, tempat terlarang, dan anomali geologis yang menentang sains modern.',
    icon: Compass,
    badge: 'MISTERI DUNIA',
    subgenres: ['Semua', 'Sejarah Kuno', 'Tempat Terlarang', 'Unsolved Cases', 'Anomali'],
  },
  konspirasi: {
    title: 'Konspirasi Global & Investigasi Dokumen Rahasia',
    subtitle: 'Penelusuran operasi intelijen bayangan, eksperimen kendali pikiran massal, dan arsip deklasifikasi tingkat tinggi.',
    icon: ShieldAlert,
    badge: 'KONSPIRASI & CYBER',
    subgenres: ['Semua', 'CIA & Intelijen', 'Dark Web', 'Teknologi Rahasia', 'Elit Global'],
  },
  horor: {
    title: 'Zona Horor, Paranormal & Urban Legend',
    subtitle: 'Kisah nyata penampakan astral, kutukan benda pusaka, ritual pesugihan berdarah, dan saksi mata generasi terakhir.',
    icon: Skull,
    badge: 'HOROR SUPERNATURAL',
    subgenres: ['Semua', 'Kisah Nyata', 'Urban Legend', 'Pesugihan', 'Kutukan'],
  },
  dokumenter: {
    title: 'Dokumenter Kriminal & Investigasi Khusus',
    subtitle: 'Rekonstruksi profil psikopat, pembunuhan berantai internasional, dan forensik digital ruang terdalam.',
    icon: FileText,
    badge: 'DOKUMENTER KHUSUS',
    subgenres: ['Semua', 'Kriminal Nyata', 'Forensik Digital', 'Sejarah Kelam', 'Investigasi'],
  },
};

export const CategoryContentPage: React.FC<CategoryContentPageProps> = ({ categoryType }) => {
  const { videos, movies, openPlayer } = useStreaming();
  const [selectedSub, setSelectedSub] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cfg = configMap[categoryType];
  const Icon = cfg.icon;

  // Filter content
  const categoryVideos = videos.filter((v) => {
    const isCat = v.categorySlug === categoryType || v.categorySlug === 'misteri';
    const matchSearch =
      searchQuery === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isCat && matchSearch && !v.isShort;
  });

  const categoryMovies = movies.filter((m) => {
    const matchType =
      m.genre.toLowerCase().includes(categoryType) ||
      (categoryType === 'horor' && m.genre.toLowerCase().includes('horor')) ||
      (categoryType === 'konspirasi' && m.genre.toLowerCase().includes('thriller')) ||
      (categoryType === 'dokumenter' && m.genre.toLowerCase().includes('dokumenter'));
    const matchSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.synopsis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Category Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#09251A] via-[#0A100D] to-[#050706] border border-[#39FF14]/30 p-6 sm:p-8 md:p-12 overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.15)] grain-overlay">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-[#39FF14] text-black">
            <Icon className="h-3.5 w-3.5" />
            {cfg.badge}
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-wide leading-tight">
            {cfg.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A968D] leading-relaxed">
            {cfg.subtitle}
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-[#39FF14]">
          <Icon className="h-64 w-64" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {cfg.subgenres.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition whitespace-nowrap cursor-pointer ${
                selectedSub === sub
                  ? 'bg-[#39FF14] text-black font-bold'
                  : 'bg-[#101713] text-[#8A968D] hover:text-white border border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A968D]" />
          <input
            type="text"
            placeholder="Cari dalam arsip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#101713] border border-white/10 text-xs text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14]"
          />
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#39FF14]" />
          Video Investigasi & Dokumentasi ({categoryVideos.length})
        </h2>

        {categoryVideos.length === 0 ? (
          <p className="text-xs text-[#8A968D]">Tidak ada video yang cocok dengan kriteria pencarian.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => openPlayer('video', video)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/60 transition-all hover:scale-[1.02] shadow-lg flex flex-col"
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="h-11 w-11 rounded-full bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_20px_#39FF14]">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 font-mono bg-black/80 text-[#8AFF68] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {video.duration}
                  </span>
                </div>
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm text-white line-clamp-2 group-hover:text-[#39FF14] transition">
                      {video.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8A968D] font-mono pt-2 border-t border-white/5">
                    <span className="text-[#39FF14]">{video.categorySlug.toUpperCase()}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-2.5 w-2.5" />
                      {video.viewsCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Cinema Movies matching this category */}
      {categoryMovies.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-ping" />
            Sinema & Film Terkait ({categoryMovies.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoryMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => openPlayer('movie', movie)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/60 transition-all hover:scale-[1.03] shadow-lg flex flex-col"
              >
                <div className="relative aspect-[2/3] w-full bg-black overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 font-mono bg-red-950/80 border border-red-700/50 text-red-300 text-[9px] px-1.5 py-0.5 rounded font-bold">
                    {movie.ageRating}
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="font-cinzel text-xs font-bold text-white line-clamp-1 group-hover:text-[#39FF14] transition">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-[#8A968D] font-mono truncate">{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
