import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../../types/index.ts';
import { Play, Info, ChevronLeft, ChevronRight, Eye, ShieldAlert } from 'lucide-react';

interface HeroBannerSliderProps {
  banners: Banner[];
  onPlayBanner: (banner: Banner) => void;
  onNavigate: (tab: string, slug?: string) => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({ banners, onPlayBanner, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const duration = activeBanners[currentIndex]?.slideDuration || 6000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeBanners, isPaused]);

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full h-[55vh] md:h-[75vh] bg-[#050706] flex items-center justify-center text-[#8A968D]">
        <div className="text-center">
          <Eye className="h-10 w-10 text-[#39FF14] mx-auto mb-2 animate-pulse" />
          <p className="font-cinzel text-lg">NGOBROL DI KANTOR</p>
          <p className="text-xs text-[#8A968D]">Memuat tayangan unggulan...</p>
        </div>
      </div>
    );
  }

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-[65vh] sm:h-[70vh] md:h-[82vh] lg:h-[88vh] bg-[#050706] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Media with Smooth Fade */}
      {activeBanners.map((banner, idx) => {
        const isCurrent = idx === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Desktop Image (Hidden on small mobile) */}
            <picture>
              <source media="(max-width: 640px)" srcSet={banner.mobileImageUrl || banner.desktopImageUrl} />
              <img
                src={banner.desktopImageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: banner.focalPoint || 'center' }}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </picture>

            {/* Dark Cinematic Vignette & Shadow Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050706] via-[#050706]/70 to-transparent max-w-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(9,37,26,0.5)_0%,transparent_70%)]" />
          </div>
        );
      })}

      {/* Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-2xl space-y-3 md:space-y-4">
          {/* Category & Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-[#39FF14] text-black shadow-[0_0_10px_rgba(57,255,20,0.4)]">
              {current.category || 'Misteri Utama'}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-950/60 border border-red-700/40 px-2 py-0.5 rounded">
              <ShieldAlert className="h-3 w-3" />
              18+
            </span>
            {current.subtitle && (
              <span className="text-[11px] font-mono text-[#8AFF68] tracking-widest hidden sm:inline">
                {current.subtitle}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight line-clamp-2 md:line-clamp-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {current.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#8A968D] line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPlayBanner(current)}
              className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(57,255,20,0.5)] active:scale-95 cursor-pointer"
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              <span>{current.buttonText || 'Tonton Sekarang'}</span>
            </button>

            <button
              onClick={() => {
                const target = current.targetUrl.replace('/', '') || 'film';
                onNavigate(target);
              }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#101713]/90 hover:bg-[#1a251f] border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14]" />
              <span>Telusuri Arsip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Navigation Controls (Desktop Arrows) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 hover:border-[#39FF14]/50 backdrop-blur-md transition cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 hover:border-[#39FF14]/50 backdrop-blur-md transition cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicator Bars / Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center space-x-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-[#39FF14] shadow-[0_0_10px_#39FF14]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
