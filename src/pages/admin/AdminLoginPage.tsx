import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Skull, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToSite }) => {
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState('admin01');
  const [password, setPassword] = useState('admin01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      adminLogin(data.token, data.admin);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050706] flex items-center justify-center p-4 grain-overlay relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(9,37,26,0.6)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-[#0A100D] border border-[#39FF14]/30 p-8 shadow-[0_0_50px_rgba(57,255,20,0.15)] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#09251A] border border-[#39FF14]/40 text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wider">
            PORTAL CMS ADMIN
          </h1>
          <p className="font-mono text-xs text-[#39FF14] tracking-widest uppercase">
            NGOBROL DI KANTOR • SECURE ACCESS
          </p>
        </div>

        {/* Notice for default initial credentials */}
        <div className="p-3 rounded-xl bg-[#09251A]/60 border border-[#39FF14]/30 text-xs text-[#8AFF68] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Kredensial Awal Sistem:</span>
          </div>
          <p className="font-mono text-[11px] text-white/80">
            Username: <strong className="text-white">admin01</strong> | Password: <strong className="text-white">admin01</strong>
          </p>
          <p className="text-[10px] text-white/60">
            *Wajib mengganti password baru saat pertama kali login.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/70 border border-red-700/50 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#8A968D]">Username Admin</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A968D]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101713] border border-white/10 text-xs text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14]"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#8A968D]">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A968D]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101713] border border-white/10 text-xs text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14]"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Memvalidasi Sesi...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-[#8A968D] hover:text-white transition cursor-pointer"
          >
            &larr; Kembali ke Website Publik
          </button>
        </div>
      </div>
    </div>
  );
};
