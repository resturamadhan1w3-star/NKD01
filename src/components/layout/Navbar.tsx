import React, { useState, useEffect } from 'react';
import { useStreaming } from '../../context/StreamingContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { PWAInstallButton } from '../common/PWAInstallButton.tsx';
import {
  Search,
  User as UserIcon,
  Menu,
  X,
  Compass,
  Film,
  Zap,
  FileText,
  Skull,
  ShieldAlert,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, slug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { settings } = useStreaming();
  const { user, signInWithGoogle, userSignOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'film', label: 'Film' },
    { id: 'misteri', label: 'Misteri' },
    { id: 'konspirasi', label: 'Konspirasi' },
    { id: 'horor', label: 'Horor' },
    { id: 'shorts', label: 'Dark Shorts' },
    { id: 'dokumenter', label: 'Dokumenter' },
    { id: 'berita', label: 'Berita' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050706]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-gradient-to-b from-[#050706] via-[#050706]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#09251A] border border-[#39FF14]/50 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-transform group-hover:scale-105">
              <Skull className="h-5 w-5 text-[#39FF14]" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#39FF14] animate-ping" />
            </div>
            <div>
              <span className="font-cinzel text-lg md:text-xl font-black tracking-wider text-white group-hover:text-[#39FF14] transition-colors">
                {settings.logo_text || 'NGOBROL DI KANTOR'}
              </span>
              <span className="block text-[9px] font-mono text-[#39FF14] tracking-widest uppercase -mt-1 hidden sm:block">
                THE DARK SIDE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'text-[#39FF14] bg-[#09251A] shadow-[0_0_10px_rgba(57,255,20,0.2)] font-semibold'
                      : 'text-[#8A968D] hover:text-[#F5F7F5] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => onNavigate('search')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'search'
                  ? 'text-[#39FF14] bg-[#09251A]'
                  : 'text-[#8A968D] hover:text-white hover:bg-white/5'
              }`}
              title="Pencarian Konten"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* PWA In-App Install Prompt */}
            <PWAInstallButton />

            {/* User Profile / Auth */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-[#39FF14]/40 hover:border-[#39FF14] transition cursor-pointer"
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.displayName || 'User'}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('akun')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101713] hover:bg-[#1a251f] border border-white/10 text-xs font-medium text-white transition cursor-pointer"
                >
                  <UserIcon className="h-3.5 w-3.5 text-[#39FF14]" />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0A100D] border border-white/10 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || 'Member'}</p>
                    <p className="text-[10px] text-[#8A968D] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('akun');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#8A968D] hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-[#39FF14]" />
                    Riwayat & Favorit
                  </button>
                  <button
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await userSignOut();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Keluar
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#8A968D] hover:text-white hover:bg-white/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-[#39FF14]" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A100D]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                currentTab === item.id
                  ? 'bg-[#09251A] text-[#39FF14] font-bold border-l-4 border-[#39FF14]'
                  : 'text-[#8A968D] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {currentTab === item.id && <Sparkles className="h-4 w-4 text-[#39FF14]" />}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2">
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#8A968D] hover:text-white"
            >
              Tentang Kami & Redaksi
            </button>
            <span className="text-[10px] font-mono text-[#39FF14]">v1.0.0 PRO</span>
          </div>
        </div>
      )}
    </header>
  );
};
