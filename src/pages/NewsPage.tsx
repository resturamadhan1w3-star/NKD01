import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext.tsx';
import { Article } from '../types/index.ts';
import { Newspaper, Search, Eye, Clock, Share2, X, ChevronRight, User, Tag } from 'lucide-react';

interface NewsPageProps {
  initialSlug?: string;
}

export const NewsPage: React.FC<NewsPageProps> = ({ initialSlug }) => {
  const { articles } = useStreaming();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    if (initialSlug) {
      return articles.find((a) => a.slug === initialSlug) || null;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [copied, setCopied] = useState(false);

  const categories = ['Semua', 'Konspirasi', 'Misteri', 'Horor', 'Dark Web'];

  const filteredArticles = articles.filter((art) => {
    const matchCat = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const headlineArticle = articles.find((a) => a.isHeadline) || articles[0];

  const handleShare = (art: Article) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: art.title,
        text: art.summary,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-[#39FF14]" />
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide">
            Warta & Jurnalisme Investigatif
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#8A968D] max-w-2xl leading-relaxed">
          Laporan eksklusif, analisis dokumen deklasifikasi, dan penelusuran fenomena tak lazim langsung dari tim redaksi NGOBROL DI KANTOR.
        </p>
      </div>

      {/* Headline Banner Article (if no search active) */}
      {!searchQuery && selectedCategory === 'Semua' && headlineArticle && (
        <div
          onClick={() => setSelectedArticle(headlineArticle)}
          className="relative rounded-2xl overflow-hidden bg-[#101713] border border-[#39FF14]/40 hover:border-[#39FF14] transition cursor-pointer group shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto h-64 sm:h-80 lg:h-[420px] bg-black overflow-hidden">
              <img
                src={headlineArticle.thumbnailUrl}
                alt={headlineArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/40 to-transparent" />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-red-600 text-white">
                    HEADLINE UTAMA
                  </span>
                  <span className="font-mono text-xs text-[#39FF14]">{headlineArticle.category}</span>
                </div>

                <h2 className="font-cinzel text-lg sm:text-2xl font-black text-white group-hover:text-[#39FF14] transition-colors leading-tight">
                  {headlineArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#8A968D] line-clamp-4 leading-relaxed">
                  {headlineArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#8A968D]">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-[#39FF14]" />
                  {headlineArticle.author}
                </span>
                <span className="flex items-center gap-1 text-[#39FF14]">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-white/10 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#39FF14] text-black font-bold'
                  : 'bg-[#101713] text-[#8A968D] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A968D]" />
          <input
            type="text"
            placeholder="Cari topik atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#101713] border border-white/10 text-xs text-white placeholder-[#8A968D] focus:outline-none focus:border-[#39FF14]"
          />
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="rounded-2xl overflow-hidden bg-[#101713] border border-white/10 hover:border-[#39FF14]/50 transition-all duration-300 hover:scale-[1.01] cursor-pointer shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={art.thumbnailUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase bg-[#09251A] text-[#39FF14] border border-[#39FF14]/40 px-2 py-0.5 rounded font-bold">
                  {art.category}
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-2">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#39FF14] transition leading-snug line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-[#8A968D] line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0 flex items-center justify-between text-[11px] font-mono text-[#8A968D] border-t border-white/5">
              <span>{art.author}</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {art.viewsCount}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#0A100D] border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl my-auto space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <span className="font-mono text-xs text-[#39FF14] bg-[#09251A] border border-[#39FF14]/40 px-2.5 py-1 rounded-full uppercase font-bold">
                {selectedArticle.category}
              </span>
              <h1 className="font-cinzel text-xl sm:text-3xl font-black text-white leading-tight">
                {selectedArticle.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8A968D] pt-1 border-b border-white/10 pb-3">
                <span>Penulis: {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.viewsCount} Kali Dibaca</span>
                <span>•</span>
                <button
                  onClick={() => handleShare(selectedArticle)}
                  className="flex items-center gap-1 text-[#39FF14] hover:underline cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden aspect-video bg-black">
              <img
                src={selectedArticle.thumbnailUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F5F7F5]/90 leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            {selectedArticle.tags && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-[#39FF14]" />
                {selectedArticle.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#101713] text-[#8A968D] border border-white/10"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
