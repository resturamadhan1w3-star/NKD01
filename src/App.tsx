import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { StreamingProvider, useStreaming } from './context/StreamingContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { MobileBottomNav } from './components/layout/MobileBottomNav.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AgeGateModal } from './components/common/AgeGateModal.tsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.tsx';
import { VideoPlayerModal } from './components/player/VideoPlayerModal.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { MoviesPage } from './pages/MoviesPage.tsx';
import { CategoryContentPage } from './pages/CategoryContentPage.tsx';
import { DarkShortsPage } from './pages/DarkShortsPage.tsx';
import { NewsPage } from './pages/NewsPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { UserAccountPage } from './pages/UserAccountPage.tsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';

function MainApp() {
  const { isAdminAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined);

  // Sync browser path on initial load
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'admin/login' || path === 'admin-login') {
      setCurrentTab('admin-login');
    } else if (path === 'admin' || path === 'admin-dashboard') {
      setCurrentTab(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login');
    } else if (['film', 'misteri', 'konspirasi', 'horor', 'shorts', 'dokumenter', 'berita', 'search', 'about', 'akun'].includes(path)) {
      setCurrentTab(path);
    }
  }, [isAdminAuthenticated]);

  const handleNavigate = (tab: string, slug?: string) => {
    setCurrentTab(tab);
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history without page reload
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    window.history.pushState({}, '', targetPath);
  };

  const isAdminView = currentTab === 'admin-dashboard' || currentTab === 'admin-login';

  return (
    <div className="min-h-screen bg-[#050706] text-[#F5F7F5] flex flex-col justify-between selection:bg-[#39FF14] selection:text-black">
      {/* 18+ Age Gate Protection Modal */}
      <AgeGateModal />

      {/* Global Video Streaming Player Modal */}
      <VideoPlayerModal />

      {/* PWA Offline Connection Indicator */}
      <OfflineIndicator />

      {/* Public Navbar (Hidden in CMS view) */}
      {!isAdminView && <Navbar currentTab={currentTab} onNavigate={handleNavigate} />}

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentTab === 'film' && <MoviesPage />}
        {currentTab === 'misteri' && <CategoryContentPage categoryType="misteri" />}
        {currentTab === 'konspirasi' && <CategoryContentPage categoryType="konspirasi" />}
        {currentTab === 'horor' && <CategoryContentPage categoryType="horor" />}
        {currentTab === 'dokumenter' && <CategoryContentPage categoryType="dokumenter" />}
        {currentTab === 'shorts' && <DarkShortsPage />}
        {currentTab === 'berita' && <NewsPage initialSlug={activeSlug} />}
        {currentTab === 'search' && <SearchPage onNavigate={handleNavigate} />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'akun' && <UserAccountPage onNavigate={handleNavigate} />}

        {/* CMS Views */}
        {currentTab === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => handleNavigate('admin-dashboard')}
            onBackToSite={() => handleNavigate('home')}
          />
        )}
        {currentTab === 'admin-dashboard' && (
          isAdminAuthenticated ? (
            <AdminDashboardPage onBackToSite={() => handleNavigate('home')} />
          ) : (
            <AdminLoginPage
              onSuccess={() => handleNavigate('admin-dashboard')}
              onBackToSite={() => handleNavigate('home')}
            />
          )
        )}
      </main>

      {/* Public Mobile Bottom Navigation (Hidden in CMS view) */}
      {!isAdminView && <MobileBottomNav currentTab={currentTab} onNavigate={handleNavigate} />}

      {/* Public Footer (Hidden in CMS view) */}
      {!isAdminView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StreamingProvider>
        <MainApp />
      </StreamingProvider>
    </AuthProvider>
  );
}
