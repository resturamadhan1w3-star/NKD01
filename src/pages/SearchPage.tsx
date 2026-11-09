import React, { useState, useEffect } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { Movie, Video, Article } from '../types/index.ts';
import { Search, Film, Video as VideoIcon, FileText, Play, Eye, Sparkles, X } from 'lucide-react';

interface SearchPageProps {
  onNavigate: (tab: string, slug?: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const { openPlayer } = useStreaming();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'videos' | 'articles'>('all');
  const [results, setResults] = useState<{
    movies: Movie[];
    videos: Video[];
    articles: Article[];
  }>({ movies: [], videos: [], articles: [] });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ movies: [], videos: [], articles: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults({
            movies: data.movies || [],
            videos: data.videos || [],
            articles: data.articles || [],
          });
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const quickKeywords = [
    'Dyatlov Pass',
    'Dark Web',
    'MKUltra',
    'Area 51',
    'Desa Penari',
    'UVB-76',
    'Palung Jawa',
  ];

  const totalResults = results.movies.length + results.videos.length + results.articles.length;

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide">
          Eksplorasi Arsip & Pencarian
        </h1>
        <p className="text-xs sm:text-sm text-[#8A968D]">
          Temukan film, arsip video investigasi, dokumen teori rahasia, atau artikel investigatif.
        </p>

        {/* Search Input Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14]" />
          <input
            type="text"
            placeholder="Ketik kata kunci, nama kasus, atau judul..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#101713] border border-[#39FF14]/40 text-sm text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.1)]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A968D] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-[11px] text-[#8A968D] font-mono mr-1">Populer:</span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#101713] hover:bg-[#09251A] text-[#8A968D] hover:text-[#39FF14] border border-white/5 hover:border-[#39FF14]/40 transition cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      {query && (
        <div className="flex items-center justify-center space-x-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'bg-[#101713] text-[#8A968D] hover:text-white'
            }`}
          >
            Semua ({totalResults})
          </button>
          <button
            onClick={() => setFilterType('movies')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterType === 'movies'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'bg-[#101713] text-[#8A968D] hover:text-white'
            }`}
          >
            Film ({results.movies.length})
          </button>
          <button
            onClick={() => setFilterType('videos')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterType === 'videos'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'bg-[#101713] text-[#8A968D] hover:text-white'
            }`}
          >
            Video ({results.videos.length})
          </button>
          <button
            onClick={() => setFilterType('articles')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterType === 'articles'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'bg-[#101713] text-[#8A968D] hover:text-white'
            }`}
          >
            Artikel ({results.articles.length})
          </button>
        </div>
      )}

      {/* Search Output */}
      {searching ? (
        <div className="text-center py-16 text-[#39FF14] animate-pulse">
          <p className="font-mono text-xs">Menelusuri database misteri...</p>
        </div>
      ) : query && totalResults === 0 ? (
        <div className="text-center py-20 text-[#8A968D] space-y-2">
          <p className="font-cinzel text-lg">Tidak ada hasil ditemukan untuk "{query}".</p>
          <p className="text-xs">Coba kata kunci lain atau periksa ejaan topik.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Movies Section */}
          {(filterType === 'all' || filterType === 'movies') && results.movies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Film className="h-5 w-5 text-[#39FF14]" />
                Koleksi Film
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {results.movies.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => openPlayer('movie', m)}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition"
                  >
                    <div className="relative aspect-[2/3] w-full bg-black">
                      <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play className="h-8 w-8 text-[#39FF14] fill-current" />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="font-bold text-xs text-white truncate">{m.title}</p>
                      <p className="text-[10px] text-[#8A968D] font-mono mt-0.5">{m.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {(filterType === 'all' || filterType === 'videos') && results.videos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-[#39FF14]" />
                Video & Investigasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.videos.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => openPlayer('video', v)}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-black">
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play className="h-8 w-8 text-[#39FF14] fill-current" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-xs sm:text-sm text-white line-clamp-2">{v.title}</p>
                      <p className="text-[10px] text-[#39FF14] font-mono mt-1 uppercase">{v.categorySlug}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {(filterType === 'all' || filterType === 'articles') && results.articles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#39FF14]" />
                Artikel Investigatif
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.articles.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onNavigate('berita', a.slug)}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 p-4 transition space-y-2"
                  >
                    <p className="text-[10px] font-mono text-[#39FF14] uppercase">{a.category}</p>
                    <h4 className="font-bold text-sm text-white line-clamp-2">{a.title}</h4>
                    <p className="text-xs text-[#8A968D] line-clamp-2">{a.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
