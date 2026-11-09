import React, { useState, useRef, useEffect } from 'react';
import { useStreaming } from '../../context/StreamingContext.tsx';
import { Video, Movie } from '../../types/index.ts';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Eye,
  ShieldAlert,
  Film,
  Sparkles,
} from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { activeMedia, closePlayer, recordWatchProgress, toggleFavorite, isFavorited, movies, videos, openPlayer } =
    useStreaming();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!activeMedia) return null;

  const item = activeMedia.item;
  const isMovie = activeMedia.type === 'movie';
  const movieItem = isMovie ? (item as Movie) : null;
  const videoItem = !isMovie ? (item as Video) : null;

  const isYouTube = videoItem?.videoType === 'youtube' && !!videoItem.youtubeVideoId;
  const favorited = isFavorited(activeMedia.type, item.id);

  // Time format helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);

      // Periodically record watch history
      if (Math.floor(videoRef.current.currentTime) % 5 === 0) {
        recordWatchProgress(Math.floor(videoRef.current.currentTime), Math.floor(videoRef.current.duration || 0));
      }
    }
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePlaybackSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextRate = speeds[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: 'Tonton di Ngobrol Di Kantor: ' + item.title,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    const thumb = isMovie ? (item as Movie).posterUrl : (item as Video).thumbnailUrl;
    const cat = isMovie ? (item as Movie).genre : (item as Video).categorySlug;
    toggleFavorite(activeMedia.type, item.id, item.title, thumb, cat);
  };

  // Recommendations
  const relatedItems = isMovie
    ? movies.filter((m) => m.id !== item.id).slice(0, 4)
    : videos.filter((v) => v.id !== item.id && !v.isShort).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0A100D] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-[#050706]">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40 font-bold uppercase shrink-0">
              {isMovie ? 'FILM' : 'VIDEO INVESTIGASI'}
            </span>
            <h3 className="font-medium text-xs sm:text-sm text-white truncate">{item.title}</h3>
          </div>
          <button
            onClick={closePlayer}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8A968D] hover:text-white transition cursor-pointer"
            aria-label="Tutup Pemutar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Display Area */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group select-none"
          onMouseMove={() => {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
          }}
        >
          {isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoItem?.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={isMovie ? movieItem?.bannerUrl : videoItem?.thumbnailUrl}
                autoPlay
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />

              {/* Custom Dark Cinematic HTML5 Controls Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-4 transition-opacity duration-300 pointer-events-none ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Top Overlay */}
                <div className="flex items-center justify-between text-xs text-white/80 pointer-events-auto">
                  <span className="font-mono text-[#39FF14] text-[11px] font-bold tracking-wider">
                    NGOBROL STREAM HD
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-red-950/80 border border-red-700/50 text-red-300 px-1.5 py-0.5 rounded">
                      18+
                    </span>
                  </div>
                </div>

                {/* Center Large Play/Pause Trigger */}
                <div className="flex items-center justify-center pointer-events-auto">
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      className="h-16 w-16 rounded-full bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_30px_#39FF14] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </button>
                  )}
                </div>

                {/* Bottom Control Bar */}
                <div className="space-y-2 pointer-events-auto">
                  {/* Seek Bar Slider */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#39FF14] hover:h-2 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center space-x-3">
                      <button onClick={togglePlay} className="hover:text-[#39FF14] transition cursor-pointer">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                      </button>

                      {/* Volume */}
                      <div className="flex items-center space-x-1.5 group/vol">
                        <button onClick={toggleMute} className="hover:text-[#39FF14] transition cursor-pointer">
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-5 w-5 text-red-400" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-14 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                        />
                      </div>

                      {/* Time Progress */}
                      <span className="font-mono text-[11px] text-[#8A968D]">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Speed */}
                      <button
                        onClick={handlePlaybackSpeed}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#09251A] hover:text-[#39FF14] text-[11px] font-mono transition cursor-pointer"
                        title="Kecepatan Pemutaran"
                      >
                        {playbackRate}x
                      </button>

                      {/* Fullscreen */}
                      <button onClick={toggleFullscreen} className="hover:text-[#39FF14] transition cursor-pointer">
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Information & Meta Details */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                {item.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A968D] font-mono">
                <span className="text-[#39FF14]">
                  {isMovie ? movieItem?.genre : videoItem?.categorySlug.toUpperCase()}
                </span>
                <span>•</span>
                {isMovie && <span>Tahun {movieItem?.releaseYear}</span>}
                {isMovie && <span>{movieItem?.durationMinutes} Menit</span>}
                {!isMovie && <span>Durasi {videoItem?.duration}</span>}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {item.viewsCount.toLocaleString()} Tayangan
                </span>
              </div>
            </div>

            {/* Action Buttons: Favorite & Share */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                  favorited
                    ? 'bg-[#09251A] text-[#39FF14] border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                    : 'bg-[#101713] text-[#8A968D] border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {favorited ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                <span>{favorited ? 'Tersimpan' : 'Favorit'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101713] hover:bg-white/5 border border-white/10 text-[#8A968D] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          {/* Description & Cast info */}
          <div className="bg-[#101713] p-4 rounded-xl border border-white/5 text-xs sm:text-sm text-[#8A968D] leading-relaxed space-y-2">
            <p>{isMovie ? movieItem?.synopsis : videoItem?.description}</p>

            {isMovie && movieItem?.director && (
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-4 text-xs font-mono">
                <div>
                  <span className="text-white/40">Sutradara: </span>
                  <span className="text-white font-medium">{movieItem.director}</span>
                </div>
                {movieItem.castList && (
                  <div>
                    <span className="text-white/40">Pemeran: </span>
                    <span className="text-white font-medium">{movieItem.castList}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Recommendations Row */}
          {relatedItems.length > 0 && (
            <div className="pt-2">
              <h4 className="font-cinzel text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#39FF14]" />
                Rekomendasi Terkait
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedItems.map((rel) => {
                  const relThumb = 'posterUrl' in rel ? rel.posterUrl : rel.thumbnailUrl;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => openPlayer('synopsis' in rel ? 'movie' : 'video', rel)}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={relThumb}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="h-7 w-7 text-[#39FF14] fill-current" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-white font-medium line-clamp-1 group-hover:text-[#39FF14] transition">
                          {rel.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
