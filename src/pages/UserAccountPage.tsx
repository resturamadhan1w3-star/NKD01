import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useStreaming } from '../context/StreamingContext.tsx';
import { User, LogIn, LogOut, Clock, Bookmark, Play, Trash2, ShieldCheck, Heart } from 'lucide-react';

interface UserAccountPageProps {
  onNavigate: (tab: string) => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({ onNavigate }) => {
  const { user, signInWithGoogle, userSignOut, guestId } = useAuth();
  const { watchHistory, favorites, movies, videos, openPlayer } = useStreaming();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg('Gagal masuk dengan Google. Pastikan popup tidak diblokir oleh browser.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* User Header Profile Card */}
      <div className="rounded-2xl bg-[#0A100D] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={
                user?.photoURL ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              }
              alt="Avatar"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            />
            {user && (
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-[#09251A] text-[#39FF14] border border-[#39FF14]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              {user?.displayName || 'Penjelajah Misteri (Guest)'}
            </h1>
            <p className="text-xs text-[#8A968D] font-mono">
              {user ? user.email : `ID Sesi: ${guestId.slice(0, 14)}...`}
            </p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#09251A] text-[#39FF14] border border-[#39FF14]/30">
              {user ? 'Anggota Terverifikasi' : 'Sesi Tamu'}
            </span>
          </div>
        </div>

        {/* Auth Action */}
        <div>
          {user ? (
            <button
              onClick={userSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-950 border border-red-800/50 text-red-300 text-xs font-medium transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Akun</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black text-xs font-bold transition shadow-[0_0_20px_rgba(57,255,20,0.4)] cursor-pointer disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                <span>{signingIn ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
              </button>
              {errorMsg && <p className="text-[10px] text-red-400 max-w-xs">{errorMsg}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Koleksi Favorit ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Riwayat Tontonan ({watchHistory.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 text-[#8A968D] space-y-2">
              <Bookmark className="h-10 w-10 mx-auto text-white/20" />
              <p className="text-sm">Belum ada tayangan atau artikel yang difavoritkan.</p>
              <button
                onClick={() => onNavigate('film')}
                className="text-xs text-[#39FF14] hover:underline cursor-pointer"
              >
                Jelajahi Film & Video Sekarang &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => {
                    const matchedMovie = movies.find((m) => m.id === fav.contentId);
                    if (matchedMovie) {
                      openPlayer('movie', matchedMovie);
                      return;
                    }
                    const matchedVideo = videos.find((v) => v.id === fav.contentId);
                    if (matchedVideo) {
                      openPlayer('video', matchedVideo);
                    }
                  }}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <img src={fav.thumbnailUrl} alt={fav.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="h-7 w-7 text-[#39FF14] fill-current" />
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#39FF14] transition">
                      {fav.title}
                    </p>
                    <span className="text-[10px] text-[#39FF14] font-mono uppercase">{fav.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {watchHistory.length === 0 ? (
            <div className="text-center py-16 text-[#8A968D] space-y-2">
              <Clock className="h-10 w-10 mx-auto text-white/20" />
              <p className="text-sm">Riwayat tontonan masih kosong.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {watchHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const matched =
                      item.contentType === 'movie'
                        ? movies.find((m) => m.id === item.contentId)
                        : videos.find((v) => v.id === item.contentId);
                    if (matched) {
                      openPlayer(item.contentType === 'movie' ? 'movie' : 'video', matched);
                    }
                  }}
                  className="rounded-xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 p-3 flex gap-3 cursor-pointer group transition"
                >
                  <div className="relative aspect-video w-28 bg-black rounded-lg overflow-hidden shrink-0">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
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
                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#39FF14] transition">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[#8A968D] font-mono uppercase mt-0.5">
                        {item.contentType}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#8AFF68] font-mono">
                      Kemajuan: {Math.floor(item.progressSeconds / 60)}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
