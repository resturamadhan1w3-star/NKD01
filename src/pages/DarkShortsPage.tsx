import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { DarkShortsPlayer } from '../components/player/DarkShortsPlayer.tsx';
import { Zap, Instagram, Film } from 'lucide-react';

export const DarkShortsPage: React.FC = () => {
  const { shorts, reels } = useStreaming();
  const [activeTab, setActiveTab] = useState<'shorts' | 'reels'>('shorts');

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-20 px-2 sm:px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#101713] border border-white/10 my-3">
        <button
          onClick={() => setActiveTab('shorts')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            activeTab === 'shorts'
              ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
              : 'text-[#8A968D] hover:text-white'
          }`}
        >
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Dark Shorts (9:16)</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            activeTab === 'reels'
              ? 'bg-[#39FF14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.3)]'
              : 'text-[#8A968D] hover:text-white'
          }`}
        >
          <Instagram className="h-3.5 w-3.5" />
          <span>Instagram Reels</span>
        </button>
      </div>

      {activeTab === 'shorts' ? (
        <DarkShortsPlayer shorts={shorts} />
      ) : (
        <div className="w-full max-w-2xl py-4 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-cinzel text-xl font-bold text-white">Instagram Reels Feed</h2>
            <p className="text-xs text-[#8A968D]">Cuplikan video vertikal resmi dari akun Instagram @ngobroldikantor.id</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl overflow-hidden bg-[#101713] border border-white/10 p-3 space-y-3"
              >
                <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black">
                  <img
                    src={reel.thumbnailUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <a
                    href={reel.reelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition group"
                  >
                    <div className="p-3 rounded-full bg-pink-600 text-white shadow-xl transition transform group-hover:scale-110">
                      <Instagram className="h-6 w-6" />
                    </div>
                  </a>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white line-clamp-1">{reel.title}</h3>
                  {reel.caption && (
                    <p className="text-xs text-[#8A968D] line-clamp-2 mt-1 leading-relaxed">
                      {reel.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
