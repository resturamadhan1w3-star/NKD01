import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { Movie } from '../types/index.ts';
import { Film, Search, Star, Play, Clock, ShieldAlert } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const { movies, openPlayer } = useStreaming();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const genres = [
    { id: 'all', label: 'Semua Film' },
    { id: 'Horor', label: 'Horor Supernatural' },
    { id: 'Cyber Thriller', label: 'Cyber Thriller' },
    { id: 'Dokumenter', label: 'Dokumenter Misteri' },
    { id: 'Kriminal', label: 'Kriminal & Konspirasi' },
    { id: 'editor', label: "Editor's Choice" },
  ];

  const filteredMovies = movies.filter((m) => {
    let matchGenre = true;
    if (selectedGenre === 'editor') {
      matchGenre = m.isEditorChoice;
    } else if (selectedGenre !== 'all') {
      matchGenre = m.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    }

    const matchSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.synopsis.toLowerCase().includes(searchQuery.toLowerCase());

    return matchGenre && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-[#39FF14]" />
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide">
            Katalog Film & Sinema Dark
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#8A968D] max-w-2xl leading-relaxed">
          Koleksi sinematik resmi film horor, thriller psikologis, investigasi kriminal, dan fiksi konspirasi berkualitas tinggi tanpa kompromi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-y border-white/10">
        {/* Genre Pill Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {genres.map((g) => {
            const active = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                    : 'bg-[#101713] text-[#8A968D] hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A968D]" />
          <input
            type="text"
            placeholder="Cari judul film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#101713] border border-white/10 text-xs text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14]"
          />
        </div>
      </div>

      {/* Movie Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 text-[#8A968D] space-y-2">
          <Film className="h-10 w-10 mx-auto text-white/20" />
          <p className="text-sm">Tidak ada film yang cocok dengan filter yang dipilih.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => openPlayer('movie', movie)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/60 transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-[0_0_25px_rgba(57,255,20,0.2)] flex flex-col"
            >
              {/* Poster 2:3 */}
              <div className="relative aspect-[2/3] w-full bg-black overflow-hidden">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="font-mono bg-red-950/80 border border-red-700/50 text-red-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {movie.ageRating}
                  </span>
                </div>

                {movie.isEditorChoice && (
                  <div className="absolute top-2 right-2">
                    <span className="font-mono bg-[#09251A] border border-[#39FF14]/50 text-[#39FF14] text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Editor's Choice
                    </span>
                  </div>
                )}

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_20px_#39FF14] transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom stats pill */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#8AFF68] font-mono">
                  <span>{movie.releaseYear}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {movie.durationMinutes}m
                  </span>
                </div>
              </div>

              {/* Title & Genre */}
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#39FF14] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-[#8A968D] font-mono mt-0.5 truncate">{movie.genre}</p>
                </div>
                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed pt-1">
                  {movie.synopsis}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
