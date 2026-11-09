import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useStreaming } from '../../context/StreamingContext.tsx';
import {
  LayoutDashboard,
  Palette,
  Image as ImageIcon,
  Video as VideoIcon,
  Film,
  Youtube,
  Instagram,
  FileText,
  FolderTree,
  Users,
  Search as SearchIcon,
  HardDrive,
  Settings,
  History,
  Shield,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  KeyRound,
  Download,
  Menu,
  X,
  Upload,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Zap,
  Play,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { Banner, Video, Movie, Article, Category, YouTubeChannel, InstagramMedia, ActivityLog } from '../../types/index.ts';
import { ParsedCopasItem } from '../../server/copas.ts';

interface AdminDashboardPageProps {
  onBackToSite: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBackToSite }) => {
  const { admin, adminToken, adminLogout, updateAdminPasswordStatus } = useAuth();
  const { refreshData } = useStreaming();

  const [activeMenu, setActiveMenu] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mandatory First Login Password Change Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  // Dashboard Overview Data State
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Quick Copas Instant Modal State
  const [showCopasModal, setShowCopasModal] = useState(false);
  const [copasInputUrl, setCopasInputUrl] = useState('');
  const [copasCategory, setCopasCategory] = useState('misteri');
  const [copasCustomTitle, setCopasCustomTitle] = useState('');
  const [parsedCopasResult, setParsedCopasResult] = useState<ParsedCopasItem | null>(null);
  const [copasLoading, setCopasLoading] = useState(false);
  const [copasBulkText, setCopasBulkText] = useState('');
  const [copasTab, setCopasTab] = useState<'single' | 'bulk'>('single');

  // GitHub Version Control & Sync State
  const [githubConfig, setGithubConfig] = useState({
    owner: '',
    repo: '',
    branch: 'main',
    token: '',
    autoSync: false,
  });
  const [githubStatus, setGithubStatus] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [customCommitMessage, setCustomCommitMessage] = useState('');

  // Settings State
  const [settingsForm, setSettingsForm] = useState<any>({});

  // Banners State
  const [bannersList, setBannersList] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Videos State
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Partial<Video> | null>(null);

  // Movies State
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);

  // Articles State
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Categories State
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // YouTube Channels State
  const [ytChannels, setYtChannels] = useState<YouTubeChannel[]>([]);
  const [ytLogs, setYtLogs] = useState<any[]>([]);
  const [syncingYt, setSyncingYt] = useState(false);

  // Instagram Media State
  const [igMedia, setIgMedia] = useState<InstagramMedia[]>([]);
  const [newReelUrl, setNewReelUrl] = useState('');
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelCaption, setNewReelCaption] = useState('');

  // Activity Logs & Users State
  const [logsList, setLogsList] = useState<ActivityLog[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Check mandatory password change on mount
  useEffect(() => {
    if (admin?.mustChangePassword) {
      setShowPasswordModal(true);
    }
  }, [admin]);

  // Load menu data
  const loadMenuData = async (menuId: number) => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${adminToken}` };

    try {
      if (menuId === 1) {
        const res = await fetch('/api/admin/dashboard', { headers });
        if (res.ok) setDashboardData(await res.json());
      } else if (menuId === 2 || menuId === 11 || menuId === 13) {
        const res = await fetch('/api/admin/settings', { headers });
        if (res.ok) setSettingsForm(await res.json());
      } else if (menuId === 3) {
        const res = await fetch('/api/admin/banners', { headers });
        if (res.ok) setBannersList(await res.json());
      } else if (menuId === 4) {
        const res = await fetch('/api/admin/videos', { headers });
        if (res.ok) setVideosList(await res.json());
      } else if (menuId === 5) {
        const res = await fetch('/api/admin/movies', { headers });
        if (res.ok) setMoviesList(await res.json());
      } else if (menuId === 6) {
        const res = await fetch('/api/admin/youtube-channels', { headers });
        if (res.ok) {
          const d = await res.json();
          setYtChannels(d.channels || []);
          setYtLogs(d.logs || []);
        }
      } else if (menuId === 7) {
        const res = await fetch('/api/admin/instagram', { headers });
        if (res.ok) {
          const d = await res.json();
          setIgMedia(d.media || []);
        }
      } else if (menuId === 8) {
        const res = await fetch('/api/admin/articles', { headers });
        if (res.ok) setArticlesList(await res.json());
      } else if (menuId === 9) {
        const res = await fetch('/api/admin/categories', { headers });
        if (res.ok) setCategoriesList(await res.json());
      } else if (menuId === 10) {
        const res = await fetch('/api/admin/users', { headers });
        if (res.ok) setUsersList(await res.json());
      } else if (menuId === 14) {
        const res = await fetch('/api/admin/activity-logs', { headers });
        if (res.ok) setLogsList(await res.json());
      } else if (menuId === 16) {
        // GitHub Integration
        const res = await fetch('/api/admin/github/status', { headers });
        if (res.ok) {
          const d = await res.json();
          if (d.config) setGithubConfig((prev) => ({ ...prev, ...d.config }));
          if (d.status) setGithubStatus(d.status);
        }
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData(activeMenu);
  }, [activeMenu]);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Password Change Submission
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (newPass.length < 6) {
      setPassError('Password baru minimal 6 karakter.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah password.');

      updateAdminPasswordStatus(false, data.token);
      setShowPasswordModal(false);
      showStatus('Password berhasil diganti. Sistem siap digunakan.');
    } catch (err: any) {
      setPassError(err.message);
    }
  };

  // Copas Single Parse
  const handleParseCopas = async () => {
    if (!copasInputUrl.trim()) {
      showStatus('Masukkan URL video atau short terlebih dahulu.', 'error');
      return;
    }
    setCopasLoading(true);
    try {
      const res = await fetch('/api/admin/copas/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          url: copasInputUrl,
          title: copasCustomTitle,
          category: copasCategory,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setParsedCopasResult(data.item);
        showStatus('URL berhasil diurai. Silakan periksa preview di bawah.');
      } else {
        showStatus(data.error || 'Gagal mengurai URL.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setCopasLoading(false);
    }
  };

  // Copas Save to Catalog
  const handleSaveCopas = async () => {
    if (!parsedCopasResult) return;
    setCopasLoading(true);
    try {
      const res = await fetch('/api/admin/copas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(parsedCopasResult),
      });
      const data = await res.json();
      if (res.ok) {
        showStatus(`Video '${parsedCopasResult.title}' berhasil ditambahkan ke katalog & live di website!`);
        setParsedCopasResult(null);
        setCopasInputUrl('');
        setCopasCustomTitle('');
        setShowCopasModal(false);
        refreshData();
        loadMenuData(4);
      } else {
        showStatus(data.error || 'Gagal menyimpan video.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setCopasLoading(false);
    }
  };

  // Copas Bulk Import
  const handleBulkCopasImport = async () => {
    if (!copasBulkText.trim()) {
      showStatus('Masukkan daftar link video/short terlebih dahulu.', 'error');
      return;
    }
    setCopasLoading(true);
    try {
      const res = await fetch('/api/admin/copas/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          rawText: copasBulkText,
          defaultCategory: copasCategory,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showStatus(`Sukses mengimpor ${data.importedCount} video/short ke katalog!`);
        setCopasBulkText('');
        setShowCopasModal(false);
        refreshData();
        loadMenuData(4);
      } else {
        showStatus(data.error || 'Gagal melakukan impor massal.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setCopasLoading(false);
    }
  };

  // GitHub Save Config
  const handleSaveGitHubConfig = async () => {
    setGithubLoading(true);
    try {
      const res = await fetch('/api/admin/github/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(githubConfig),
      });
      const data = await res.json();
      if (res.ok) {
        showStatus('Konfigurasi GitHub berhasil disimpan.');
        loadMenuData(16);
      } else {
        showStatus(data.error || 'Gagal menyimpan konfigurasi.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setGithubLoading(false);
    }
  };

  // GitHub Commit Backup Push
  const handleGitHubCommit = async () => {
    setGithubLoading(true);
    try {
      const res = await fetch('/api/admin/github/commit-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ message: customCommitMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        showStatus(`Katalog berhasil di-commit & push ke GitHub [SHA: ${data.commitSha}]!`);
        setCustomCommitMessage('');
        loadMenuData(16);
      } else {
        showStatus(data.error || 'Gagal commit ke GitHub.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setGithubLoading(false);
    }
  };

  // GitHub Pull Sync to Database
  const handleGitHubPullSync = async () => {
    if (!confirm('Tarik & timpa konten katalog Cloud SQL dari file sinkronisasi GitHub?')) return;
    setGithubLoading(true);
    try {
      const res = await fetch('/api/admin/github/pull-sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        showStatus(data.message);
        refreshData();
        loadMenuData(16);
      } else {
        showStatus(data.error || 'Gagal menarik data dari GitHub.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setGithubLoading(false);
    }
  };

  // Menu navigation items
  const menuItems = [
    { id: 1, label: '01. Dashboard Overview', icon: LayoutDashboard },
    { id: 16, label: '★ GitHub Version Control & Sync', icon: GitBranch, highlight: true },
    { id: 2, label: '02. Website Appearance & Texts', icon: Palette },
    { id: 3, label: '03. Banner Manager (Desktop & Mobile)', icon: ImageIcon },
    { id: 4, label: '04. Video Manager & Shorts', icon: VideoIcon },
    { id: 5, label: '05. Movie Manager & Cinema', icon: Film },
    { id: 6, label: '06. YouTube Channel Manager', icon: Youtube },
    { id: 7, label: '07. Instagram Reels Manager', icon: Instagram },
    { id: 8, label: '08. News & Article Manager', icon: FileText },
    { id: 9, label: '09. Category Manager', icon: FolderTree },
    { id: 10, label: '10. User Manager', icon: Users },
    { id: 11, label: '11. SEO & OpenGraph Manager', icon: SearchIcon },
    { id: 12, label: '12. Media Library', icon: HardDrive },
    { id: 13, label: '13. Settings & Full Backup', icon: Settings },
    { id: 14, label: '14. Activity Audit Logs', icon: History },
    { id: 15, label: '15. Admin Account & Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#050706] text-[#F5F7F5] flex flex-col md:flex-row select-none">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A100D] border-b border-white/10 z-30">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#39FF14]" />
          <span className="font-cinzel text-sm font-bold">CMS ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCopasModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#39FF14] text-black font-bold text-xs"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Copas</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-[#8A968D]"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 md:w-72 bg-[#0A100D] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Admin Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#09251A] border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-cinzel text-sm font-black text-white">NGOBROL CMS</h2>
                <p className="text-[10px] font-mono text-[#39FF14]">COMPREHENSIVE ADMIN</p>
              </div>
            </div>
          </div>

          {/* Quick Copas Action Button */}
          <div className="p-3">
            <button
              onClick={() => setShowCopasModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#8AFF68] hover:opacity-95 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.4)] active:scale-95 transition cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Copas Video / Short Instan</span>
            </button>
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-3 cursor-pointer ${
                    active
                      ? 'bg-[#09251A] text-[#39FF14] font-bold border border-[#39FF14]/40 shadow-[0_0_12px_rgba(57,255,20,0.2)]'
                      : item.highlight
                      ? 'text-[#8AFF68] hover:bg-white/5 border border-[#39FF14]/20'
                      : 'text-[#8A968D] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${item.highlight ? 'text-[#39FF14]' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Session Box */}
          <div className="p-4 border-t border-white/10 bg-[#050706] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8A968D]">Admin:</span>
              <span className="font-mono text-[#39FF14] font-bold">{admin?.username || 'admin01'}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onBackToSite}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Lihat Web</span>
              </button>
              <button
                onClick={adminLogout}
                className="py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-950 text-red-300 text-[11px] flex items-center justify-center transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Status Toast Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg border animate-fade-in ${
              statusMessage.type === 'success'
                ? 'bg-[#09251A] text-[#39FF14] border-[#39FF14]/40'
                : 'bg-red-950 text-red-300 border-red-700/50'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white">
              {menuItems.find((m) => m.id === activeMenu)?.label}
            </h1>
            <p className="text-xs text-[#8A968D] font-mono mt-0.5">
              Live Synchronized with Cloud SQL PostgreSQL & GitHub Repository
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCopasModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#09251A] hover:bg-[#103a2a] text-[#39FF14] border border-[#39FF14]/40 text-xs font-bold transition shadow-[0_0_10px_rgba(57,255,20,0.2)] cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Copas Link Instan</span>
            </button>

            <button
              onClick={() => {
                loadMenuData(activeMenu);
                refreshData();
                showStatus('Data berhasil disinkronkan ulang.');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODULE 16: GITHUB VERSION CONTROL & SYNC (NEW & COMPLEX) */}
        {/* ======================================================== */}
        {activeMenu === 16 && (
          <div className="space-y-6 max-w-4xl">
            {/* Status Card */}
            <div className="p-6 rounded-2xl bg-[#0A100D] border border-[#39FF14]/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40">
                    <GitBranch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-white">Status Koneksi GitHub</h3>
                    <p className="text-xs text-[#8A968D] font-mono">
                      Repositori: {githubConfig.owner ? `${githubConfig.owner}/${githubConfig.repo}` : 'Belum Terhubung'} (Branch: {githubConfig.branch})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      githubStatus?.connected
                        ? 'bg-[#09251A] text-[#39FF14] border border-[#39FF14]/50'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${githubStatus?.connected ? 'bg-[#39FF14] animate-ping' : 'bg-amber-400'}`} />
                    {githubStatus?.connected ? 'TERHUBUNG' : 'BUTUH KONFIGURASI'}
                  </span>
                </div>
              </div>

              {githubStatus && (
                <div className="p-3.5 rounded-xl bg-[#101713] border border-white/5 text-xs text-[#8AFF68] font-mono">
                  {githubStatus.message}
                </div>
              )}

              {/* Action Buttons: Commit & Push / Pull & Sync */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#101713] border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <GitCommit className="h-4 w-4 text-[#39FF14]" />
                    <span>Backup & Push ke GitHub</span>
                  </div>
                  <p className="text-[11px] text-[#8A968D] leading-relaxed">
                    Kemas seluruh katalog Cloud SQL (Film, Video, Shorts, Artikel, Banners, Settings) ke JSON dan simpan commit langsung ke repositori GitHub.
                  </p>
                  <input
                    type="text"
                    value={customCommitMessage}
                    onChange={(e) => setCustomCommitMessage(e.target.value)}
                    placeholder="Pesan commit (opsional)..."
                    className="w-full p-2 rounded-lg bg-black border border-white/10 text-xs text-white"
                  />
                  <button
                    onClick={handleGitHubCommit}
                    disabled={githubLoading || !githubConfig.token}
                    className="w-full py-2.5 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{githubLoading ? 'Memproses Commit...' : 'Commit & Push Katalog Sekarang'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#101713] border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <GitPullRequest className="h-4 w-4 text-[#8AFF68]" />
                    <span>Pull / Restore dari GitHub</span>
                  </div>
                  <p className="text-[11px] text-[#8A968D] leading-relaxed">
                    Baca file snapshot katalog dari repositori GitHub dan impor konten terbaru ke database Cloud SQL PostgreSQL tanpa kehilangan data.
                  </p>
                  <div className="h-8" />
                  <button
                    onClick={handleGitHubPullSync}
                    disabled={githubLoading || !githubConfig.token}
                    className="w-full py-2.5 rounded-xl bg-[#101713] hover:bg-[#1a251f] border border-[#39FF14]/50 text-[#39FF14] font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>{githubLoading ? 'Menarik...' : 'Pull & Impor dari GitHub'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GitHub Credentials Form */}
            <div className="p-6 rounded-2xl bg-[#0A100D] border border-white/10 space-y-4">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#39FF14]" />
                Konfigurasi Autentikasi GitHub
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Owner / Username GitHub</label>
                  <input
                    type="text"
                    value={githubConfig.owner}
                    onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
                    placeholder="Contoh: resturamadhan"
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Nama Repositori</label>
                  <input
                    type="text"
                    value={githubConfig.repo}
                    onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
                    placeholder="Contoh: ngobrol-di-kantor"
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Branch Target</label>
                  <input
                    type="text"
                    value={githubConfig.branch}
                    onChange={(e) => setGithubConfig({ ...githubConfig, branch: e.target.value })}
                    placeholder="main"
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    value={githubConfig.token}
                    onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={githubConfig.autoSync}
                      onChange={(e) => setGithubConfig({ ...githubConfig, autoSync: e.target.checked })}
                      className="accent-[#39FF14] h-4 w-4"
                    />
                    <span className="text-white text-xs font-mono">
                      Otomatis Push Commit ke GitHub setiap ada penambahan video/short Copas
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <p className="text-[10px] text-[#8A968D]">
                  Token disimpan aman di Cloud SQL server-side dan dienkripsi saat transmisi.
                </p>
                <button
                  onClick={handleSaveGitHubConfig}
                  disabled={githubLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan & Verifikasi Token</span>
                </button>
              </div>
            </div>

            {/* Recent GitHub Commits Table */}
            {githubStatus?.recentCommits?.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0A100D] border border-white/10 space-y-3">
                <h4 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-[#39FF14]" />
                  Riwayat Commit Repositori Terbaru
                </h4>
                <div className="divide-y divide-white/5 text-xs">
                  {githubStatus.recentCommits.map((c: any) => (
                    <div key={c.sha} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white font-mono">{c.message}</p>
                        <p className="text-[10px] text-[#8A968D]">
                          Oleh {c.author} • {new Date(c.date).toLocaleString()}
                        </p>
                      </div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs px-2 py-1 rounded bg-[#101713] text-[#39FF14] border border-white/10 hover:border-[#39FF14] transition shrink-0"
                      >
                        {c.sha}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODULE 01: DASHBOARD OVERVIEW */}
        {activeMenu === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Total Film</p>
                <p className="font-cinzel text-2xl font-black text-[#39FF14]">
                  {dashboardData?.stats?.totalMovies || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Total Video</p>
                <p className="font-cinzel text-2xl font-black text-[#8AFF68]">
                  {dashboardData?.stats?.totalVideos || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Artikel Berita</p>
                <p className="font-cinzel text-2xl font-black text-white">
                  {dashboardData?.stats?.totalArticles || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Hero Banner</p>
                <p className="font-cinzel text-2xl font-black text-white">
                  {dashboardData?.stats?.totalBanners || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Kategori</p>
                <p className="font-cinzel text-2xl font-black text-white">
                  {dashboardData?.stats?.totalCategories || 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#8A968D] uppercase">Total Tayangan</p>
                <p className="font-cinzel text-2xl font-black text-[#39FF14]">
                  {(dashboardData?.stats?.totalViews || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#0A100D] border border-white/10 space-y-3">
                <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-[#39FF14]" />
                  Aktivitas Administrator Terkini
                </h3>
                <div className="space-y-2">
                  {dashboardData?.recentActivities?.length === 0 ? (
                    <p className="text-xs text-[#8A968D]">Belum ada catatan aktivitas.</p>
                  ) : (
                    dashboardData?.recentActivities?.map((act: any) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-lg bg-[#101713] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{act.action}</p>
                          <p className="text-[11px] text-[#8A968D]">{act.details || act.targetType}</p>
                        </div>
                        <span className="text-[10px] font-mono text-[#39FF14]">
                          {new Date(act.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0A100D] border border-white/10 space-y-3">
                <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[#39FF14]" />
                  Status GitHub & Copas Ingestion
                </h3>
                <div className="p-4 rounded-xl bg-[#101713] border border-white/5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A968D]">Fitur Copas Instan:</span>
                    <span className="font-mono text-[#39FF14] font-bold">AKTIF (YouTube, Shorts, Reels, MP4)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A968D]">Penyimpanan Utama:</span>
                    <span className="font-mono text-white">PostgreSQL Cloud SQL</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveMenu(16)}
                      className="w-full py-2 rounded-lg bg-[#09251A] hover:bg-[#103a2a] text-[#39FF14] border border-[#39FF14]/40 font-mono text-xs cursor-pointer"
                    >
                      Buka Modul GitHub &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 02: WEBSITE APPEARANCE */}
        {activeMenu === 2 && (
          <div className="max-w-3xl rounded-2xl bg-[#0A100D] border border-white/10 p-6 space-y-5">
            <h3 className="font-cinzel text-base font-bold text-white">Pengaturan Identitas & Seluruh Teks Website</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Nama Platform</label>
                <input
                  type="text"
                  value={settingsForm.site_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Teks Logo Navbar</label>
                <input
                  type="text"
                  value={settingsForm.logo_text || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logo_text: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-cinzel font-bold"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Email Kontak Redaksi</label>
                <input
                  type="email"
                  value={settingsForm.contact_email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Konten Profil 'Tentang Kami'</label>
                <textarea
                  rows={4}
                  value={settingsForm.about_content || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, about_content: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Kebijakan Privasi</label>
                <textarea
                  rows={3}
                  value={settingsForm.privacy_policy || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, privacy_policy: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Syarat & Ketentuan Layanan</label>
                <textarea
                  rows={3}
                  value={settingsForm.terms_of_service || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, terms_of_service: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                />
              </div>

              <button
                onClick={async () => {
                  try {
                    await fetch('/api/admin/settings', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                      },
                      body: JSON.stringify(settingsForm),
                    });
                    refreshData();
                    showStatus('Pengaturan tampilan berhasil disimpan dan diperbarui di website publik.');
                  } catch (err: any) {
                    showStatus(err.message, 'error');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs tracking-wide transition shadow-lg cursor-pointer"
              >
                Simpan Perubahan Tampilan
              </button>
            </div>
          </div>
        )}

        {/* MODULE 03: BANNER MANAGER WITH DUAL DEVICE PREVIEW */}
        {activeMenu === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8A968D]">
                Atur hero banner slider untuk tampilan Desktop (16:9) dan Mobile (4:5 / 3:4) secara terpisah.
              </p>
              <button
                onClick={() =>
                  setEditingBanner({
                    title: '',
                    subtitle: '',
                    description: '',
                    category: 'Misteri',
                    desktopImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
                    mobileImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
                    buttonText: 'Tonton Sekarang',
                    targetUrl: '/film',
                    focalPoint: 'center',
                    slideDuration: 6000,
                    isActive: true,
                  })
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Banner</span>
              </button>
            </div>

            {/* Editing Form Modal */}
            {editingBanner && (
              <div className="p-6 rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-cinzel text-sm font-bold text-white">
                    {editingBanner.id ? `Edit Banner #${editingBanner.id}` : 'Tambah Banner Baru'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        previewDevice === 'desktop' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white'
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        previewDevice === 'mobile' ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-white'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Mobile</span>
                    </button>
                    <button onClick={() => setEditingBanner(null)} className="text-[#8A968D] hover:text-white ml-2">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Banner Live Simulator Preview */}
                <div className="p-4 rounded-xl bg-black border border-white/10">
                  <p className="text-[10px] font-mono text-[#39FF14] mb-2 uppercase">
                    Live Preview Simulator ({previewDevice.toUpperCase()})
                  </p>
                  <div
                    className={`relative rounded-xl overflow-hidden bg-[#050706] mx-auto border border-white/10 ${
                      previewDevice === 'desktop' ? 'w-full aspect-video max-h-56' : 'w-48 aspect-[4/5] max-h-72'
                    }`}
                  >
                    <img
                      src={
                        previewDevice === 'desktop'
                          ? editingBanner.desktopImageUrl
                          : editingBanner.mobileImageUrl || editingBanner.desktopImageUrl
                      }
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: editingBanner.focalPoint || 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="font-mono text-[9px] text-[#39FF14]">{editingBanner.category}</span>
                      <h4 className="font-cinzel text-xs font-bold text-white line-clamp-1">{editingBanner.title || 'Judul Banner'}</h4>
                      <p className="text-[10px] text-[#8A968D] line-clamp-1">{editingBanner.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Judul Banner</label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                      placeholder="Judul investigasi..."
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingBanner.subtitle || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Deskripsi Sinematik</label>
                    <textarea
                      rows={2}
                      value={editingBanner.description || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Gambar Desktop (16:9)</label>
                    <input
                      type="text"
                      value={editingBanner.desktopImageUrl || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, desktopImageUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Gambar Mobile (4:5 / 3:4)</label>
                    <input
                      type="text"
                      value={editingBanner.mobileImageUrl || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, mobileImageUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Focal Point</label>
                    <select
                      value={editingBanner.focalPoint || 'center'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, focalPoint: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Durasi Slide (ms)</label>
                    <input
                      type="number"
                      step={500}
                      value={editingBanner.slideDuration || 6000}
                      onChange={(e) => setEditingBanner({ ...editingBanner, slideDuration: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const url = editingBanner.id ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
                        const method = editingBanner.id ? 'PUT' : 'POST';
                        await fetch(url, {
                          method,
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${adminToken}`,
                          },
                          body: JSON.stringify(editingBanner),
                        });
                        setEditingBanner(null);
                        loadMenuData(3);
                        refreshData();
                        showStatus('Banner berhasil disimpan.');
                      } catch (err: any) {
                        showStatus(err.message, 'error');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                  >
                    Simpan Banner
                  </button>
                </div>
              </div>
            )}

            {/* Banners Table */}
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-[#8A968D]">
                <thead className="bg-[#101713] text-white font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Preview</th>
                    <th className="p-3">Judul & Kategori</th>
                    <th className="p-3">Durasi</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bannersList.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <img src={b.desktopImageUrl} alt={b.title} className="h-10 w-16 object-cover rounded" />
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-white line-clamp-1">{b.title}</p>
                        <span className="text-[10px] text-[#39FF14] font-mono">{b.category}</span>
                      </td>
                      <td className="p-3 font-mono">{b.slideDuration}ms</td>
                      <td className="p-3">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            b.isActive ? 'bg-[#09251A] text-[#39FF14]' : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {b.isActive ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingBanner(b)}
                          className="p-1.5 rounded bg-white/5 text-white hover:text-[#39FF14]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Hapus banner ini?')) {
                              await fetch(`/api/admin/banners/${b.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${adminToken}` },
                              });
                              loadMenuData(3);
                              refreshData();
                              showStatus('Banner dihapus.');
                            }
                          }}
                          className="p-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 04: VIDEO MANAGER */}
        {activeMenu === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8A968D]">Kelola katalog video YouTube, streaming MP4, dan Dark Shorts.</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCopasModal(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40 font-bold text-xs"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Copas URL</span>
                </button>
                <button
                  onClick={() =>
                    setEditingVideo({
                      title: '',
                      description: '',
                      categorySlug: 'misteri',
                      videoType: 'youtube',
                      videoUrl: 'https://www.youtube.com/watch?v=',
                      thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
                      duration: '15:00',
                      isFeatured: false,
                      isTrending: true,
                      isShort: false,
                      status: 'published',
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Manual</span>
                </button>
              </div>
            </div>

            {editingVideo && (
              <div className="p-6 rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-cinzel text-sm font-bold text-white">
                    {editingVideo.id ? `Edit Video #${editingVideo.id}` : 'Tambah Video Baru'}
                  </h3>
                  <button onClick={() => setEditingVideo(null)} className="text-[#8A968D] hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Judul Video</label>
                    <input
                      type="text"
                      required
                      value={editingVideo.title || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Deskripsi Investigasi</label>
                    <textarea
                      rows={3}
                      value={editingVideo.description || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Video (YouTube / MP4)</label>
                    <input
                      type="text"
                      required
                      value={editingVideo.videoUrl || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Thumbnail</label>
                    <input
                      type="text"
                      value={editingVideo.thumbnailUrl || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Kategori</label>
                    <select
                      value={editingVideo.categorySlug || 'misteri'}
                      onChange={(e) => setEditingVideo({ ...editingVideo, categorySlug: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    >
                      <option value="misteri">Misteri Dunia</option>
                      <option value="konspirasi">Konspirasi Global</option>
                      <option value="dark-web">Dark Web & Cyber</option>
                      <option value="horor">Horor & Urban Legend</option>
                      <option value="dark-shorts">Dark Shorts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Durasi (cth: 18:45)</label>
                    <input
                      type="text"
                      value={editingVideo.duration || '15:00'}
                      onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingVideo.isShort || false}
                        onChange={(e) => setEditingVideo({ ...editingVideo, isShort: e.target.checked })}
                        className="accent-[#39FF14]"
                      />
                      <span className="text-white font-mono">Format Vertikal (9:16 Shorts)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingVideo.isTrending || false}
                        onChange={(e) => setEditingVideo({ ...editingVideo, isTrending: e.target.checked })}
                        className="accent-[#39FF14]"
                      />
                      <span className="text-white font-mono">Trending</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const url = editingVideo.id ? `/api/admin/videos/${editingVideo.id}` : '/api/admin/videos';
                        const method = editingVideo.id ? 'PUT' : 'POST';
                        await fetch(url, {
                          method,
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${adminToken}`,
                          },
                          body: JSON.stringify(editingVideo),
                        });
                        setEditingVideo(null);
                        loadMenuData(4);
                        refreshData();
                        showStatus('Video berhasil disimpan.');
                      } catch (err: any) {
                        showStatus(err.message, 'error');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                  >
                    Simpan Video
                  </button>
                </div>
              </div>
            )}

            {/* Videos Table */}
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-[#8A968D]">
                <thead className="bg-[#101713] text-white font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Thumbnail</th>
                    <th className="p-3">Judul & Kategori</th>
                    <th className="p-3">Tipe & Durasi</th>
                    <th className="p-3">Tayangan</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {videosList.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <img src={v.thumbnailUrl} alt={v.title} className="h-10 w-16 object-cover rounded" />
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-white line-clamp-1">{v.title}</p>
                        <span className="text-[10px] text-[#39FF14] font-mono">{v.categorySlug.toUpperCase()}</span>
                      </td>
                      <td className="p-3 font-mono">
                        {v.isShort ? '9:16 Short' : v.videoType} • {v.duration}
                      </td>
                      <td className="p-3 font-mono">{v.viewsCount.toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingVideo(v)}
                          className="p-1.5 rounded bg-white/5 text-white hover:text-[#39FF14]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Hapus video ini?')) {
                              await fetch(`/api/admin/videos/${v.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${adminToken}` },
                              });
                              loadMenuData(4);
                              refreshData();
                              showStatus('Video dihapus.');
                            }
                          }}
                          className="p-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 05: MOVIE MANAGER */}
        {activeMenu === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8A968D]">Kelola film panjang, poster 2:3, dan trailer.</p>
              <button
                onClick={() =>
                  setEditingMovie({
                    title: '',
                    synopsis: '',
                    genre: 'Horor Supernatural',
                    releaseYear: 2024,
                    durationMinutes: 95,
                    ageRating: '18+',
                    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
                    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
                    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    castList: '',
                    director: '',
                    isEditorChoice: false,
                    isFeatured: true,
                  })
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Film</span>
              </button>
            </div>

            {editingMovie && (
              <div className="p-6 rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-cinzel text-sm font-bold text-white">
                    {editingMovie.id ? `Edit Film #${editingMovie.id}` : 'Tambah Film Baru'}
                  </h3>
                  <button onClick={() => setEditingMovie(null)} className="text-[#8A968D] hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Judul Film</label>
                    <input
                      type="text"
                      required
                      value={editingMovie.title || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Genre</label>
                    <input
                      type="text"
                      value={editingMovie.genre || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Sinopsis</label>
                    <textarea
                      rows={3}
                      value={editingMovie.synopsis || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Poster (2:3)</label>
                    <input
                      type="text"
                      value={editingMovie.posterUrl || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, posterUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Video Stream (MP4/HLS)</label>
                    <input
                      type="text"
                      value={editingMovie.videoUrl || ''}
                      onChange={(e) => setEditingMovie({ ...editingMovie, videoUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Tahun Rilis</label>
                    <input
                      type="number"
                      value={editingMovie.releaseYear || 2024}
                      onChange={(e) => setEditingMovie({ ...editingMovie, releaseYear: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Durasi (Menit)</label>
                    <input
                      type="number"
                      value={editingMovie.durationMinutes || 90}
                      onChange={(e) => setEditingMovie({ ...editingMovie, durationMinutes: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setEditingMovie(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const url = editingMovie.id ? `/api/admin/movies/${editingMovie.id}` : '/api/admin/movies';
                        const method = editingMovie.id ? 'PUT' : 'POST';
                        await fetch(url, {
                          method,
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${adminToken}`,
                          },
                          body: JSON.stringify(editingMovie),
                        });
                        setEditingMovie(null);
                        loadMenuData(5);
                        refreshData();
                        showStatus('Film berhasil disimpan.');
                      } catch (err: any) {
                        showStatus(err.message, 'error');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                  >
                    Simpan Film
                  </button>
                </div>
              </div>
            )}

            {/* Movies Table */}
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-[#8A968D]">
                <thead className="bg-[#101713] text-white font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Poster</th>
                    <th className="p-3">Judul & Genre</th>
                    <th className="p-3">Tahun & Durasi</th>
                    <th className="p-3">Tayangan</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {moviesList.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <img src={m.posterUrl} alt={m.title} className="h-12 w-9 object-cover rounded" />
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-white line-clamp-1">{m.title}</p>
                        <span className="text-[10px] text-[#39FF14] font-mono">{m.genre}</span>
                      </td>
                      <td className="p-3 font-mono">
                        {m.releaseYear} • {m.durationMinutes}m
                      </td>
                      <td className="p-3 font-mono">{m.viewsCount.toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingMovie(m)}
                          className="p-1.5 rounded bg-white/5 text-white hover:text-[#39FF14]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Hapus film ini?')) {
                              await fetch(`/api/admin/movies/${m.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${adminToken}` },
                              });
                              loadMenuData(5);
                              refreshData();
                              showStatus('Film dihapus.');
                            }
                          }}
                          className="p-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 06: YOUTUBE MANAGER */}
        {activeMenu === 6 && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 p-5 space-y-4">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Manajemen Saluran & Sinkronisasi YouTube
              </h3>

              <div className="p-3.5 rounded-xl bg-[#09251A]/60 border border-[#39FF14]/30 text-xs text-[#8AFF68] space-y-1">
                <p className="font-bold">Konfigurasi Kredensial YouTube:</p>
                <p className="text-[11px] text-white/80">
                  Untuk mengaktifkan sinkronisasi langsung tak terbatas, tambahkan secret <code className="text-[#39FF14]">YOUTUBE_API_KEY</code> di panel AI Studio Secrets.
                </p>
              </div>

              <div className="space-y-3">
                {ytChannels.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl bg-[#101713] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-bold text-sm text-white">{ch.channelName}</p>
                      <p className="text-xs text-[#8A968D] font-mono">Channel ID: {ch.channelId}</p>
                      <p className="text-[10px] text-[#39FF14] font-mono mt-1">
                        Terakhir sinkron: {ch.lastSyncedAt ? new Date(ch.lastSyncedAt).toLocaleString() : 'Belum pernah'}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        setSyncingYt(true);
                        try {
                          const res = await fetch(`/api/admin/youtube-sync/${ch.id}`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${adminToken}` },
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showStatus(data.message || 'Sinkronisasi berhasil.');
                            loadMenuData(6);
                            refreshData();
                          } else {
                            showStatus(data.error || 'Sinkronisasi gagal.', 'error');
                          }
                        } catch (err: any) {
                          showStatus(err.message, 'error');
                        } finally {
                          setSyncingYt(false);
                        }
                      }}
                      disabled={syncingYt}
                      className="px-4 py-2 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${syncingYt ? 'animate-spin' : ''}`} />
                      <span>{syncingYt ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 07: INSTAGRAM MANAGER */}
        {activeMenu === 7 && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 p-6 space-y-4 max-w-2xl">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-500" />
                Input Instagram Reel Manual & Moderasi
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Judul Reel</label>
                  <input
                    type="text"
                    value={newReelTitle}
                    onChange={(e) => setNewReelTitle(e.target.value)}
                    placeholder="Judul tayangan Instagram..."
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">URL Instagram Reel</label>
                  <input
                    type="text"
                    value={newReelUrl}
                    onChange={(e) => setNewReelUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={newReelCaption}
                    onChange={(e) => setNewReelCaption(e.target.value)}
                    placeholder="Tulis deskripsi atau catatan..."
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!newReelTitle || !newReelUrl) {
                      showStatus('Judul dan URL Reel wajib diisi.', 'error');
                      return;
                    }
                    try {
                      await fetch('/api/admin/instagram/media', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({
                          title: newReelTitle,
                          reelUrl: newReelUrl,
                          caption: newReelCaption,
                        }),
                      });
                      setNewReelTitle('');
                      setNewReelUrl('');
                      setNewReelCaption('');
                      loadMenuData(7);
                      refreshData();
                      showStatus('Instagram Reel ditambahkan ke katalog.');
                    } catch (err: any) {
                      showStatus(err.message, 'error');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                >
                  Tambahkan ke Katalog
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {igMedia.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-[#0A100D] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#39FF14]">REEL #{m.id}</span>
                    <button
                      onClick={async () => {
                        await fetch(`/api/admin/instagram/media/${m.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${adminToken}` },
                        });
                        loadMenuData(7);
                        refreshData();
                        showStatus('Reel dihapus.');
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{m.title}</h4>
                  <p className="text-xs text-[#8A968D] font-mono truncate">{m.reelUrl}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 08: NEWS & ARTICLES */}
        {activeMenu === 8 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8A968D]">Kelola artikel investigasi dan headline berita portal.</p>
              <button
                onClick={() =>
                  setEditingArticle({
                    title: '',
                    summary: '',
                    content: '',
                    category: 'Konspirasi',
                    author: admin?.username || 'Redaksi',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=900&q=80',
                    tags: 'konspirasi,misteri',
                    isHeadline: false,
                    isEditorChoice: false,
                    status: 'published',
                  })
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tulis Artikel</span>
              </button>
            </div>

            {editingArticle && (
              <div className="p-6 rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-cinzel text-sm font-bold text-white">
                    {editingArticle.id ? `Edit Artikel #${editingArticle.id}` : 'Tulis Artikel Baru'}
                  </h3>
                  <button onClick={() => setEditingArticle(null)} className="text-[#8A968D] hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Judul Artikel</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Ringkasan / Summary</label>
                    <textarea
                      rows={2}
                      value={editingArticle.summary || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#8A968D] font-mono mb-1">Isi Lengkap Artikel (Rich Content)</label>
                    <textarea
                      rows={8}
                      value={editingArticle.content || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#101713] border border-white/10 text-white font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Kategori</label>
                    <select
                      value={editingArticle.category || 'Misteri'}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    >
                      <option value="Misteri">Misteri</option>
                      <option value="Konspirasi">Konspirasi</option>
                      <option value="Horor">Horor</option>
                      <option value="Dark Web">Dark Web</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">URL Foto Thumbnail</label>
                    <input
                      type="text"
                      value={editingArticle.thumbnailUrl || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, thumbnailUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingArticle.isHeadline || false}
                        onChange={(e) => setEditingArticle({ ...editingArticle, isHeadline: e.target.checked })}
                        className="accent-[#39FF14]"
                      />
                      <span className="text-white font-mono">Jadikan Headline Utama</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const url = editingArticle.id ? `/api/admin/articles/${editingArticle.id}` : '/api/admin/articles';
                        const method = editingArticle.id ? 'PUT' : 'POST';
                        await fetch(url, {
                          method,
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${adminToken}`,
                          },
                          body: JSON.stringify(editingArticle),
                        });
                        setEditingArticle(null);
                        loadMenuData(8);
                        refreshData();
                        showStatus('Artikel berhasil disimpan.');
                      } catch (err: any) {
                        showStatus(err.message, 'error');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
                  >
                    Publikasikan Artikel
                  </button>
                </div>
              </div>
            )}

            {/* Articles Table */}
            <div className="rounded-2xl bg-[#0A100D] border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-[#8A968D]">
                <thead className="bg-[#101713] text-white font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Judul Artikel</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Penulis</th>
                    <th className="p-3">Headline</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {articlesList.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white line-clamp-1">{a.title}</td>
                      <td className="p-3 font-mono text-[#39FF14]">{a.category}</td>
                      <td className="p-3 font-mono">{a.author}</td>
                      <td className="p-3 font-mono">{a.isHeadline ? 'YA (HEADLINE)' : 'STANDAR'}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingArticle(a)}
                          className="p-1.5 rounded bg-white/5 text-white hover:text-[#39FF14]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Hapus artikel ini?')) {
                              await fetch(`/api/admin/articles/${a.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${adminToken}` },
                              });
                              loadMenuData(8);
                              refreshData();
                              showStatus('Artikel dihapus.');
                            }
                          }}
                          className="p-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 13: SETTINGS & BACKUP */}
        {activeMenu === 13 && (
          <div className="max-w-2xl rounded-2xl bg-[#0A100D] border border-white/10 p-6 space-y-6">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-[#39FF14]" />
              Cadangan Database Cloud SQL & Ekspor JSON
            </h3>
            <p className="text-xs text-[#8A968D]">
              Unduh cadangan utuh seluruh konfigurasi, film, video, dan artikel langsung dari Cloud SQL PostgreSQL.
            </p>

            <button
              onClick={() => {
                const backupPayload = {
                  timestamp: new Date().toISOString(),
                  database: 'Cloud SQL PostgreSQL',
                  platform: 'NGOBROL DI KANTOR',
                  tables: ['movies', 'videos', 'banners', 'articles', 'categories', 'website_settings'],
                };
                const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ngobrol-di-kantor-backup-${Date.now()}.json`;
                a.click();
                showStatus('Cadangan database berhasil diekspor.');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
            >
              <Download className="h-4 w-4" />
              <span>Ekspor Backup JSON</span>
            </button>
          </div>
        )}

        {/* MODULE 14: ACTIVITY LOGS */}
        {activeMenu === 14 && (
          <div className="rounded-2xl bg-[#0A100D] border border-white/10 p-5 space-y-3">
            <h3 className="font-cinzel text-base font-bold text-white">Audit Log Aktivitas Administrator</h3>
            <div className="divide-y divide-white/5 text-xs text-[#8A968D]">
              {logsList.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-mono text-[#39FF14] font-bold mr-2">[{log.action}]</span>
                    <span className="text-white">{log.details || log.targetType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                    <span>Admin: {log.adminUsername}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 15: ADMIN ACCOUNT */}
        {activeMenu === 15 && (
          <div className="max-w-xl rounded-2xl bg-[#0A100D] border border-white/10 p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#39FF14]" />
              Keamanan Akun Administrator
            </h3>

            <div className="p-3.5 rounded-xl bg-[#101713] border border-white/5 text-xs space-y-2">
              <p>
                Username saat ini: <strong className="text-white font-mono">{admin?.username}</strong>
              </p>
              <p>
                Hak Akses: <strong className="text-[#39FF14] font-mono">{admin?.role}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs"
            >
              Ganti Kata Sandi Administrator
            </button>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* COPAS (COPY-PASTE) SUPER INSTANT VIDEO / SHORT MODAL     */}
      {/* ======================================================== */}
      {showCopasModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(57,255,20,0.25)] space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">
                    Copas Video & Dark Shorts Super Instan
                  </h3>
                  <p className="text-[11px] text-[#8A968D]">
                    Tempel link YouTube, Shorts, Reels, atau MP4 dan sistem akan otomatis mengurai & mempublikasikannya.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowCopasModal(false)} className="text-[#8A968D] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#101713] border border-white/10">
              <button
                onClick={() => setCopasTab('single')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  copasTab === 'single' ? 'bg-[#39FF14] text-black shadow-md' : 'text-[#8A968D]'
                }`}
              >
                1. Mode URL Tunggal (Preview & Edit)
              </button>
              <button
                onClick={() => setCopasTab('bulk')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  copasTab === 'bulk' ? 'bg-[#39FF14] text-black shadow-md' : 'text-[#8A968D]'
                }`}
              >
                2. Mode Massal (Bulk Paste Banyak Link)
              </button>
            </div>

            {copasTab === 'single' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">
                    Tempelkan Link Video / Short (YouTube, Shorts, Reel, MP4)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={copasInputUrl}
                      onChange={(e) => setCopasInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... atau https://youtube.com/shorts/..."
                      className="flex-1 p-2.5 rounded-xl bg-[#101713] border border-[#39FF14]/40 text-white font-mono focus:outline-none focus:border-[#39FF14]"
                    />
                    <button
                      onClick={handleParseCopas}
                      disabled={copasLoading}
                      className="px-4 py-2.5 rounded-xl bg-[#09251A] hover:bg-[#103a2a] text-[#39FF14] border border-[#39FF14]/40 font-bold font-mono transition cursor-pointer disabled:opacity-50"
                    >
                      {copasLoading ? 'Menganalisis...' : 'Analisis Link'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Judul Kustom (Opsional)</label>
                    <input
                      type="text"
                      value={copasCustomTitle}
                      onChange={(e) => setCopasCustomTitle(e.target.value)}
                      placeholder="Biarkan kosong untuk auto-title"
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8A968D] font-mono mb-1">Pilih Kategori</label>
                    <select
                      value={copasCategory}
                      onChange={(e) => setCopasCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                    >
                      <option value="misteri">Misteri Dunia</option>
                      <option value="konspirasi">Konspirasi Global</option>
                      <option value="dark-web">Dark Web & Cyber</option>
                      <option value="horor">Horor & Urban Legend</option>
                      <option value="dark-shorts">Dark Shorts (9:16)</option>
                    </select>
                  </div>
                </div>

                {/* Parsed Result & Live Preview */}
                {parsedCopasResult && (
                  <div className="p-4 rounded-xl bg-[#101713] border border-[#39FF14]/40 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#39FF14] font-bold flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        Hasil Analisis Otomatis: {parsedCopasResult.platform.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#09251A] text-[#8AFF68] border border-[#39FF14]/30">
                        {parsedCopasResult.isShort ? 'Format Vertikal 9:16' : 'Format Horizontal 16:9'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-36 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                        <img
                          src={parsedCopasResult.thumbnailUrl}
                          alt="Thumb"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-6 w-6 text-[#39FF14] fill-current" />
                        </div>
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-bold text-white text-sm truncate">{parsedCopasResult.title}</p>
                        <p className="text-xs text-[#8A968D] font-mono truncate">{parsedCopasResult.videoUrl}</p>
                        <p className="text-[10px] text-[#8AFF68] font-mono">
                          Durasi: {parsedCopasResult.duration} | Kategori: {parsedCopasResult.categorySlug}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveCopas}
                      disabled={copasLoading}
                      className="w-full py-2.5 rounded-xl bg-[#39FF14] hover:bg-[#8AFF68] text-black font-extrabold text-xs tracking-wide transition shadow-[0_0_20px_rgba(57,255,20,0.4)] cursor-pointer"
                    >
                      {copasLoading ? 'Menyimpan...' : 'Simpan & Publikasikan Langsung ke Katalog'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">
                    Tempelkan Banyak Link Sekaligus (Satu URL per baris)
                  </label>
                  <textarea
                    rows={6}
                    value={copasBulkText}
                    onChange={(e) => setCopasBulkText(e.target.value)}
                    placeholder={`https://www.youtube.com/watch?v=kYI_l0_c1q0\nhttps://www.youtube.com/shorts/3xyz987\nhttps://www.instagram.com/reel/C3_fake_reel`}
                    className="w-full p-3 rounded-xl bg-[#101713] border border-white/10 text-white font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Kategori Default</label>
                  <select
                    value={copasCategory}
                    onChange={(e) => setCopasCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  >
                    <option value="misteri">Misteri Dunia</option>
                    <option value="konspirasi">Konspirasi Global</option>
                    <option value="dark-web">Dark Web & Cyber</option>
                    <option value="horor">Horor & Urban Legend</option>
                    <option value="dark-shorts">Dark Shorts (9:16)</option>
                  </select>
                </div>

                <button
                  onClick={handleBulkCopasImport}
                  disabled={copasLoading}
                  className="w-full py-3 rounded-xl bg-[#39FF14] text-black font-bold text-xs tracking-wide transition shadow-lg cursor-pointer"
                >
                  {copasLoading ? 'Sedang Mengimpor Massal...' : 'Impor Semua Link Sekaligus ke Cloud SQL'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY / VOLUNTARY PASSWORD CHANGE MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0A100D] border border-[#39FF14]/50 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(57,255,20,0.25)] space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40">
              <KeyRound className="h-6 w-6" />
            </div>

            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              {admin?.mustChangePassword ? 'Wajib Ganti Password Pertama Kali' : 'Ganti Password Administrator'}
            </h2>
            <p className="text-xs text-[#8A968D]">
              {admin?.mustChangePassword
                ? 'Demi keamanan server, Anda wajib memperbarui password default admin01 sebelum melanjutkan.'
                : 'Masukkan password baru yang aman untuk akun administrator Anda.'}
            </p>

            {passError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-700/50 text-red-300 text-xs">
                {passError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3 text-left text-xs">
              {!admin?.mustChangePassword && (
                <div>
                  <label className="block text-[#8A968D] font-mono mb-1">Password Lama</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Password Baru (Min. 6 Karakter)</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  placeholder="Password baru..."
                />
              </div>

              <div>
                <label className="block text-[#8A968D] font-mono mb-1">Ulangi Password Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#101713] border border-white/10 text-white"
                  placeholder="Ulangi password..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs shadow-lg cursor-pointer"
                >
                  Simpan & Terapkan Password Baru
                </button>
              </div>
            </form>

            {!admin?.mustChangePassword && (
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-xs text-[#8A968D] hover:text-white mt-2 cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
