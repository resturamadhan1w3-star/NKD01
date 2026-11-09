import React from 'react';
import { Home, Film, Zap, Newspaper, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'film', label: 'Film', icon: Film },
    { id: 'shorts', label: 'Shorts', icon: Zap, badge: '9:16' },
    { id: 'berita', label: 'Berita', icon: Newspaper },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A100D]/95 backdrop-blur-xl border-t border-white/10 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
                isActive ? 'text-[#39FF14]' : 'text-[#8A968D] hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[8px] font-mono px-1 rounded-sm bg-[#39FF14] text-black font-extrabold leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
