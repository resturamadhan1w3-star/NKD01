import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldAlert, AlertTriangle, Eye, Skull } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const { isAgeVerified, verifyAge } = useAuth();

  if (isAgeVerified) return null;

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#39FF14]/30 bg-[#0A100D] p-6 md:p-8 text-center shadow-[0_0_50px_rgba(57,255,20,0.15)] grain-overlay">
        {/* Glow corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#39FF14]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#39FF14]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#39FF14]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#39FF14]" />

        {/* Brand Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#09251A] border border-[#39FF14]/40 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
          <Skull className="h-8 w-8 text-[#39FF14] animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-red-950/80 text-red-400 border border-red-700/50 mb-3">
          <AlertTriangle className="h-3.5 w-3.5" />
          ADULT CONTENT AREA • 18+ ONLY
        </span>

        <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-wider text-[#F5F7F5] mb-1 neon-glow">
          NGOBROL DI KANTOR
        </h1>
        <p className="font-mono text-xs text-[#39FF14] tracking-widest uppercase mb-4">
          THE DARK SIDE OF EVERY STORY.
        </p>

        <div className="rounded-xl bg-[#101713] border border-white/10 p-4 text-left text-xs md:text-sm text-[#8A968D] space-y-2 mb-6">
          <div className="flex items-start gap-2.5">
            <Eye className="h-4 w-4 text-[#39FF14] shrink-0 mt-0.5" />
            <span>Platform ini berisi dokumentasi investigasi kriminal nyata, teori konspirasi terlarang, penelusuran dark web, serta materi horor psikologis yang mungkin mengganggu.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>Hanya ditujukan untuk pemirsa dewasa berusia 18 tahun ke atas. Dengan melanjutkan, Anda menyatakan telah cukup umur secara hukum.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={verifyAge}
            className="flex-1 py-3 px-6 rounded-lg bg-[#39FF14] hover:bg-[#8AFF68] text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] active:scale-95 cursor-pointer"
          >
            SAYA BERUSIA 18 TAHUN ATAU LEBIH
          </button>
          <button
            onClick={handleExit}
            className="py-3 px-6 rounded-lg bg-[#101713] hover:bg-[#1a251f] text-[#8A968D] hover:text-white font-medium text-sm transition-all border border-white/10 cursor-pointer"
          >
            Keluar
          </button>
        </div>

        <p className="mt-4 text-[10px] text-white/40">
          Verifikasi Anda disimpan secara aman untuk sesi penjelajahan di platform ini.
        </p>
      </div>
    </div>
  );
};
