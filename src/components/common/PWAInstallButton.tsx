import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09251A] hover:bg-[#103a2a] text-[#39FF14] border border-[#39FF14]/40 text-xs font-medium tracking-wide transition shadow-[0_0_10px_rgba(57,255,20,0.2)] active:scale-95 cursor-pointer"
        title="Pasang aplikasi di perangkat Anda"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#09251A]/80 hover:bg-[#09251A] text-[#8AFF68] border border-[#39FF14]/30 text-xs font-medium transition cursor-pointer"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0A100D] border border-[#39FF14]/40 p-6 text-center shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[#8A968D] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#09251A] text-[#39FF14]">
                <Smartphone className="h-6 w-6" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white mb-2">
                Pasang di iPhone / iPad
              </h3>
              <p className="text-xs text-[#8A968D] mb-4 leading-relaxed">
                Nikmati pengalaman streaming layar penuh seperti aplikasi native tanpa instalasi App Store:
              </p>

              <div className="space-y-2.5 text-left text-xs bg-[#101713] p-3.5 rounded-xl border border-white/5 mb-5">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-4 w-4 text-[#39FF14] shrink-0" />
                  <span>1. Ketuk tombol <strong>Share</strong> (ikon kotak panah atas) di toolbar Safari.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-4 w-4 text-[#39FF14] shrink-0" />
                  <span>2. Gulir ke bawah dan pilih <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-4 w-4 text-[#39FF14] shrink-0" />
                  <span>3. Ketuk <strong>Add</strong> di pojok kanan atas.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-lg bg-[#39FF14] text-black font-semibold text-xs transition active:scale-95 cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
