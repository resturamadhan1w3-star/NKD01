import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { Skull, ShieldAlert, Mail, FileText, CheckCircle2, Lock, HelpCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useStreaming();
  const [activeSection, setActiveSection] = useState<'about' | 'privacy' | 'terms' | 'copyright'>('about');

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Brand Hero */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#09251A] border border-[#39FF14]/40 text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.25)]">
          <Skull className="h-8 w-8" />
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white tracking-wide">
          {settings.site_name || 'NGOBROL DI KANTOR'}
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#39FF14] tracking-widest uppercase">
          {settings.tagline || 'THE DARK SIDE OF EVERY STORY.'}
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center justify-center space-x-2 border-y border-white/10 py-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSection('about')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer whitespace-nowrap ${
            activeSection === 'about'
              ? 'bg-[#39FF14] text-black font-bold'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          Tentang Kami
        </button>
        <button
          onClick={() => setActiveSection('privacy')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer whitespace-nowrap ${
            activeSection === 'privacy'
              ? 'bg-[#39FF14] text-black font-bold'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          Kebijakan Privasi
        </button>
        <button
          onClick={() => setActiveSection('terms')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer whitespace-nowrap ${
            activeSection === 'terms'
              ? 'bg-[#39FF14] text-black font-bold'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          Ketentuan Layanan
        </button>
        <button
          onClick={() => setActiveSection('copyright')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer whitespace-nowrap ${
            activeSection === 'copyright'
              ? 'bg-[#39FF14] text-black font-bold'
              : 'bg-[#101713] text-[#8A968D] hover:text-white'
          }`}
        >
          Kebijakan Hak Cipta
        </button>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl bg-[#0A100D] border border-white/10 p-6 sm:p-10 text-xs sm:text-sm text-[#8A968D] leading-relaxed space-y-6 shadow-xl">
        {activeSection === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white mb-2">Visi & Misi Redaksi</h2>
              <p className="whitespace-pre-line text-[#F5F7F5]/90">
                {settings.about_content ||
                  `NGOBROL DI KANTOR lahir sebagai respon terhadap kebutuhan ruang investigasi independen yang membahas misteri dunia, teori konspirasi global, dan fenomena horor tanpa sensor berlebihan namun tetap menjunjung tinggi etika jurnalisme dan verifikasi data.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-xl bg-[#101713] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldAlert className="h-4 w-4 text-[#39FF14]" />
                  <span>Kategori Konten 18+</span>
                </div>
                <p className="text-xs">
                  Seluruh materi film, investigasi forensik, dan rekaman audio visual ditujukan khusus untuk kalangan dewasa 18 tahun ke atas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101713] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Mail className="h-4 w-4 text-[#39FF14]" />
                  <span>Kerjasama & Kontak</span>
                </div>
                <p className="text-xs">
                  Email Redaksi: <span className="font-mono text-[#39FF14]">{settings.contact_email || 'redaksi@ngobroldikantor.com'}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-cinzel text-xl font-bold text-white">Kebijakan Privasi Pengguna</h2>
            <p className="whitespace-pre-line text-[#F5F7F5]/90">
              {settings.privacy_policy ||
                `1. Data yang Kami Kumpulkan: Kami hanya mengumpulkan informasi dasar akun Google (email, nama profil) jika Anda memilih login, serta riwayat tontonan dan daftar favorit di platform ini.\n\n2. Penggunaan Data: Data digunakan murni untuk memulihkan preferensi tontonan Anda dan tidak pernah diperjualbelikan kepada broker data atau pengiklan pihak ketiga.`}
            </p>
          </div>
        )}

        {activeSection === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-cinzel text-xl font-bold text-white">Ketentuan Penggunaan Layanan</h2>
            <p className="whitespace-pre-line text-[#F5F7F5]/90">
              {settings.terms_of_service ||
                `1. Pengguna wajib berusia minimal 18 tahun untuk mengakses platform ini.\n\n2. Seluruh video, film, dan artikel disajikan untuk tujuan edukasi, hiburan, dan analisis kritis.\n\n3. Pengguna dilarang menyebarkan ujaran kebencian, konten ilegal, atau mencoba meretas infrastruktur streaming NGOBROL DI KANTOR.`}
            </p>
          </div>
        )}

        {activeSection === 'copyright' && (
          <div className="space-y-4">
            <h2 className="font-cinzel text-xl font-bold text-white">Kebijakan Hak Cipta & Fair Use</h2>
            <p className="leading-relaxed text-[#F5F7F5]/90">
              Platform NGOBROL DI KANTOR menghormati seluruh hak kekayaan intelektual kreator dan pemegang lisensi. Video YouTube yang ditampilkan menggunakan embed resmi sesuai ketentuan pengembang Google YouTube API. Arsip dokumen sejarah bersumber dari domain publik atau dokumen deklasifikasi resmi. Jika Anda adalah pemegang hak cipta yang sah dan menemukan materi yang memerlukan peninjauan lisensi, silakan hubungi redaksi@ngobroldikantor.com untuk tindak lanjut cepat dalam waktu 1x24 jam.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
