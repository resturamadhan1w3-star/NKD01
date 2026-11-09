import React from 'react';
import { Skull, ShieldAlert, Lock, Youtube, Instagram, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A100D] border-t border-white/10 pt-14 pb-24 lg:pb-12 text-[#8A968D] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#09251A] border border-[#39FF14]/40 text-[#39FF14]">
                <Skull className="h-5 w-5" />
              </div>
              <span className="font-cinzel text-lg font-black tracking-wider text-white">
                NGOBROL DI KANTOR
              </span>
            </div>
            <p className="font-mono text-xs text-[#39FF14] tracking-wider uppercase">
              THE DARK SIDE OF EVERY STORY.
            </p>
            <p className="text-xs leading-relaxed max-w-md text-[#8A968D]">
              Platform streaming digital misteri, konspirasi global, investigasi kejahatan dark web, arsip rahasia sejarah, dan film horor independen premium. Mengungkap apa yang selama ini tersembunyi di balik bayang-bayang.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-red-400/90 bg-red-950/30 border border-red-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Khusus Pemirsa Dewasa (18+). Berisi materi investigasi sensitif & horor psikologis.</span>
            </div>
          </div>

          {/* Kolom Eksplorasi */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              Eksplorasi Misteri
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('film')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Katalog Film & Thriller
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('misteri')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Misteri Dunia & Sejarah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('konspirasi')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Konspirasi & Investigasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('horor')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Horor & Urban Legend
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dokumenter')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Dokumenter Kriminal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shorts')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Dark Shorts (9:16)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Redaksi & Informasi */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              Redaksi & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('berita')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Warta & Berita Terbaru
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Tentang Kami & Redaksi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Pedoman & Kebijakan Hak Cipta
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#39FF14] transition cursor-pointer">
                  Syarat & Ketentuan Layanan
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Saluran & Kontak */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              Saluran Terhubung
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#39FF14] transition"
              >
                <Youtube className="h-4 w-4 text-red-500" />
                <span>YouTube Channel</span>
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#39FF14] transition"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                <span>Instagram Reels</span>
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <div className="flex items-center gap-2 text-white/70 pt-2">
                <Mail className="h-4 w-4 text-[#39FF14]" />
                <span className="font-mono text-[11px]">redaksi@ngobroldikantor.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Discreet CMS Link */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} NGOBROL DI KANTOR. Seluruh hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="text-white/30">Didukung oleh Cloud SQL & High-Bitrate Media Streaming</span>
            {/* Discreet CMS Portal Link */}
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-white/20 hover:text-[#39FF14] transition flex items-center gap-1 cursor-pointer"
              title="Portal Khusus Administrator"
            >
              <Lock className="h-3 w-3" />
              <span className="font-mono text-[10px]">Portal CMS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
