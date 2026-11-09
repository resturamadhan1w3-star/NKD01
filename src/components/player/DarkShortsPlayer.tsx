import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types/index.ts';
import { useStreaming } from '../../context/StreamingContext.tsx';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';

interface DarkShortsPlayerProps {
  shorts: Video[];
}

export const DarkShortsPlayer: React.FC<DarkShortsPlayerProps> = ({ shorts }) => {
  const { toggleFavorite, isFavorited } = useStreaming();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef<number | null>(null);

  const currentShort = shorts[currentIndex] || shorts[0];
  const favorited = currentShort ? isFavorited('video', currentShort.id) : false;

  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(shorts.length - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartY.current = null;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentShort.title,
        text: currentShort.title + ' di Ngobrol Di Kantor Shorts',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!shorts || shorts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-[#8A968D]">
        <p>Belum ada Dark Shorts yang diunggah.</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[9/16] max-h-[82vh] rounded-2xl overflow-hidden bg-black border border-[#39FF14]/30 shadow-[0_0_40px_rgba(57,255,20,0.15)] select-none my-2 sm:my-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentShort.videoUrl}
        poster={currentShort.thumbnailUrl}
        autoPlay
        playsInline
        loop
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Subtle Film Grain Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#39FF14]/40 text-[#39FF14] text-xs font-mono font-bold">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>DARK SHORTS</span>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Center Play/Pause indicator when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
        >
          <div className="h-16 w-16 rounded-full bg-[#39FF14]/90 text-black flex items-center justify-center shadow-[0_0_30px_#39FF14] animate-pulse">
            <Play className="h-8 w-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Right Floating Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 z-20">
        <button
          onClick={() =>
            toggleFavorite('video', currentShort.id, currentShort.title, currentShort.thumbnailUrl, 'dark-shorts')
          }
          className="flex flex-col items-center gap-1 text-white hover:text-[#39FF14] transition cursor-pointer"
        >
          <div className={`p-2.5 rounded-full backdrop-blur-md border ${favorited ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'bg-black/60 border-white/20'}`}>
            {favorited ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </div>
          <span className="text-[10px] font-mono">{favorited ? 'Disimpan' : 'Favorit'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-white hover:text-[#39FF14] transition cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono">{copied ? 'Tersalin' : 'Share'}</span>
        </button>
      </div>

      {/* Bottom Metadata & Caption */}
      <div className="absolute bottom-4 left-4 right-16 z-20 space-y-1.5 text-left">
        <span className="text-[10px] font-mono uppercase text-[#39FF14] tracking-wider">
          @{currentShort.categorySlug || 'ngobroldikantor'}
        </span>
        <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">
          {currentShort.title}
        </h3>
        <p className="text-xs text-[#8A968D] line-clamp-2 drop-shadow-sm leading-relaxed">
          {currentShort.description}
        </p>
      </div>

      {/* Desktop Vertical Navigation Controls */}
      <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col space-y-3 z-30">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/70 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 backdrop-blur-md transition cursor-pointer"
          title="Short Sebelumnya"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/70 hover:bg-[#09251A] text-white hover:text-[#39FF14] border border-white/10 backdrop-blur-md transition cursor-pointer"
          title="Short Selanjutnya"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
