import React, { useRef } from 'react';
import { Movie, Video } from '../../types/index.ts';
import { Play, ChevronLeft, ChevronRight, Eye, Clock, ShieldAlert, Star } from 'lucide-react';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  type: 'movie' | 'video' | 'short';
  items: (Movie | Video)[];
  onSelect: (item: Movie | Video) => void;
  onViewAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  subtitle,
  type,
  items,
  onSelect,
  onViewAll,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-4 md:py-6 group/row">
      {/* Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
              {title}
            </h2>
            {type === 'short' && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#39FF14] text-black font-extrabold">
                9:16
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[#8A968D] mt-0.5">{subtitle}</p>}
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-[#39FF14] hover:text-[#8AFF68] font-mono tracking-wider transition cursor-pointer flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Row Controls */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 translate-y-2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/70 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 hover:border-[#39FF14]/50 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer shadow-xl"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 translate-y-2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/70 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 hover:border-[#39FF14]/50 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer shadow-xl"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={rowRef}
        className="flex space-x-3 sm:space-x-4 overflow-x-auto px-4 sm:px-6 lg:px-8 py-2 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => {
          const isMovie = 'synopsis' in item;
          const isShort = type === 'short';

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex-none group cursor-pointer transition-all duration-300 hover:scale-[1.03] select-none ${
                isShort
                  ? 'w-36 sm:w-44 md:w-52 aspect-[9/16]'
                  : isMovie
                  ? 'w-36 sm:w-44 md:w-52 aspect-[2/3]'
                  : 'w-60 sm:w-72 md:w-80 aspect-video'
              }`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#101713] border border-white/10 group-hover:border-[#39FF14]/50 shadow-lg group-hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                {/* Thumbnail / Poster */}
                <img
                  src={isMovie ? item.posterUrl : item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px]">
                  {isMovie && (
                    <span className="font-mono bg-red-950/80 border border-red-700/50 text-red-300 px-1.5 py-0.5 rounded font-bold">
                      {item.ageRating}
                    </span>
                  )}
                  {isMovie && item.isEditorChoice && (
                    <span className="font-mono bg-[#09251A] border border-[#39FF14]/50 text-[#39FF14] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Editor's Choice
                    </span>
                  )}
                  {!isMovie && !isShort && 'duration' in item && (
                    <span className="ml-auto font-mono bg-black/80 text-[#8AFF68] border border-white/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {item.duration}
                    </span>
                  )}
                  {isShort && (
                    <span className="font-mono bg-[#39FF14] text-black px-1.5 py-0.5 rounded font-extrabold">
                      SHORT
                    </span>
                  )}
                </div>

                {/* Center Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-11 w-11 rounded-full bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_20px_#39FF14] transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                  <h3 className="font-medium text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#39FF14] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-[#8A968D] font-mono">
                    <span>{isMovie ? item.genre : 'categorySlug' in item ? item.categorySlug.toUpperCase() : 'MISTERI'}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-2.5 w-2.5" />
                      {item.viewsCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
