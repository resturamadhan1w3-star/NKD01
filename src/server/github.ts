import { db } from '../db/index.ts';
import {
  websiteSettings,
  movies,
  videos,
  articles,
  banners,
  categories,
} from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  autoSync: boolean;
}

export async function getGitHubConfig(): Promise<GitHubConfig> {
  const settingsList = await db.select().from(websiteSettings);
  const map = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    owner: map['github_repo_owner'] || '',
    repo: map['github_repo_name'] || '',
    branch: map['github_branch'] || 'main',
    token: map['github_token'] || process.env.GITHUB_TOKEN || '',
    autoSync: map['github_auto_sync'] === 'true',
  };
}

export async function checkGitHubStatus(config: GitHubConfig) {
  if (!config.token || !config.owner || !config.repo) {
    return {
      connected: false,
      message: 'Konfigurasi GitHub belum lengkap (Owner, Repo, atau Personal Access Token belum diisi).',
      repoDetails: null,
      recentCommits: [],
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'NgobrolDiKantor-Streaming-Platform',
    };

    // 1. Check repository details
    const repoRes = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, { headers });
    if (!repoRes.ok) {
      const errData = await repoRes.json();
      return {
        connected: false,
        message: `Gagal mengakses repositori: ${errData.message || repoRes.statusText}`,
        repoDetails: null,
        recentCommits: [],
      };
    }
    const repoDetails = await repoRes.json();

    // 2. Fetch latest commits
    const commitsRes = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/commits?sha=${config.branch}&per_page=6`,
      { headers }
    );
    let recentCommits: any[] = [];
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      if (Array.isArray(commitsData)) {
        recentCommits = commitsData.map((c: any) => ({
          sha: c.sha.slice(0, 7),
          fullSha: c.sha,
          message: c.commit.message,
          author: c.commit.author.name,
          date: c.commit.author.date,
          url: c.html_url,
        }));
      }
    }

    return {
      connected: true,
      message: `Terhubung dengan repositori GitHub: ${repoDetails.full_name}`,
      repoDetails: {
        fullName: repoDetails.full_name,
        description: repoDetails.description,
        isPrivate: repoDetails.private,
        defaultBranch: repoDetails.default_branch,
        stars: repoDetails.stargazers_count,
        updatedAt: repoDetails.updated_at,
        url: repoDetails.html_url,
      },
      recentCommits,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: `Terjadi kendala koneksi GitHub: ${error.message}`,
      repoDetails: null,
      recentCommits: [],
    };
  }
}

export async function commitCatalogToGitHub(config: GitHubConfig, commitMessage?: string) {
  if (!config.token || !config.owner || !config.repo) {
    throw new Error('Konfigurasi GitHub belum lengkap.');
  }

  const headers = {
    Authorization: `Bearer ${config.token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'NgobrolDiKantor-Streaming-Platform',
  };

  // Compile full database catalog into clean JSON
  const [allMovies, allVideos, allArticles, allBanners, allCategories, allSettings] = await Promise.all([
    db.select().from(movies),
    db.select().from(videos),
    db.select().from(articles),
    db.select().from(banners),
    db.select().from(categories),
    db.select().from(websiteSettings),
  ]);

  const catalogPayload = {
    platform: 'NGOBROL DI KANTOR',
    tagline: 'THE DARK SIDE OF EVERY STORY.',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    stats: {
      totalMovies: allMovies.length,
      totalVideos: allVideos.length,
      totalArticles: allArticles.length,
      totalBanners: allBanners.length,
      totalCategories: allCategories.length,
    },
    settings: allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>),
    categories: allCategories,
    banners: allBanners,
    movies: allMovies,
    videos: allVideos,
    articles: allArticles,
  };

  const fileContentBase64 = Buffer.from(JSON.stringify(catalogPayload, null, 2)).toString('base64');
  const filePath = 'data/ndk-catalog-sync.json';

  // Check if file exists to get current SHA (required by GitHub API for updates)
  let existingSha: string | undefined = undefined;
  try {
    const getFileRes = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`,
      { headers }
    );
    if (getFileRes.ok) {
      const fileMeta = await getFileRes.json();
      existingSha = fileMeta.sha;
    }
  } catch {
    // New file
  }

  const commitBody: any = {
    message: commitMessage || `CMS Sync: Update katalog NGOBROL DI KANTOR (${new Date().toLocaleString()})`,
    content: fileContentBase64,
    branch: config.branch,
  };
  if (existingSha) {
    commitBody.sha = existingSha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(commitBody),
    }
  );

  if (!putRes.ok) {
    const errData = await putRes.json();
    throw new Error(`Gagal push commit ke GitHub: ${errData.message || putRes.statusText}`);
  }

  const result = await putRes.json();
  return {
    success: true,
    commitSha: result.commit?.sha?.slice(0, 7),
    commitUrl: result.commit?.html_url,
    filePath,
  };
}

export async function pullCatalogFromGitHub(config: GitHubConfig) {
  if (!config.token || !config.owner || !config.repo) {
    throw new Error('Konfigurasi GitHub belum lengkap.');
  }

  const headers = {
    Authorization: `Bearer ${config.token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'NgobrolDiKantor-Streaming-Platform',
  };

  const filePath = 'data/ndk-catalog-sync.json';
  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`,
    { headers }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(`File ${filePath} tidak ditemukan di branch ${config.branch}: ${errData.message || res.statusText}`);
  }

  const fileData = await res.json();
  const rawContent = Buffer.from(fileData.content, 'base64').toString('utf8');
  const payload = JSON.parse(rawContent);

  let importedMovies = 0;
  let importedVideos = 0;
  let importedArticles = 0;

  // Sync / Upsert movies
  if (Array.isArray(payload.movies)) {
    for (const m of payload.movies) {
      const exist = await db.select().from(movies).where(eq(movies.slug, m.slug)).limit(1);
      if (exist.length === 0) {
        await db.insert(movies).values({
          title: m.title,
          slug: m.slug,
          synopsis: m.synopsis,
          genre: m.genre || 'Horor',
          releaseYear: m.releaseYear || 2024,
          durationMinutes: m.durationMinutes || 90,
          ageRating: m.ageRating || '18+',
          posterUrl: m.posterUrl,
          bannerUrl: m.bannerUrl || m.posterUrl,
          videoUrl: m.videoUrl,
          trailerUrl: m.trailerUrl,
          castList: m.castList,
          director: m.director,
          isEditorChoice: Boolean(m.isEditorChoice),
          isFeatured: Boolean(m.isFeatured),
        });
        importedMovies++;
      }
    }
  }

  // Sync / Upsert videos
  if (Array.isArray(payload.videos)) {
    for (const v of payload.videos) {
      const exist = await db.select().from(videos).where(eq(videos.slug, v.slug)).limit(1);
      if (exist.length === 0) {
        await db.insert(videos).values({
          title: v.title,
          slug: v.slug,
          description: v.description,
          categorySlug: v.categorySlug || 'misteri',
          videoType: v.videoType || 'youtube',
          videoUrl: v.videoUrl,
          youtubeVideoId: v.youtubeVideoId,
          thumbnailUrl: v.thumbnailUrl,
          duration: v.duration || '10:00',
          isFeatured: Boolean(v.isFeatured),
          isTrending: Boolean(v.isTrending),
          isShort: Boolean(v.isShort),
          status: v.status || 'published',
        });
        importedVideos++;
      }
    }
  }

  // Sync / Upsert articles
  if (Array.isArray(payload.articles)) {
    for (const a of payload.articles) {
      const exist = await db.select().from(articles).where(eq(articles.slug, a.slug)).limit(1);
      if (exist.length === 0) {
        await db.insert(articles).values({
          title: a.title,
          slug: a.slug,
          summary: a.summary,
          content: a.content,
          category: a.category || 'Misteri',
          author: a.author || 'Redaksi',
          thumbnailUrl: a.thumbnailUrl,
          tags: a.tags || 'misteri',
          isHeadline: Boolean(a.isHeadline),
          isEditorChoice: Boolean(a.isEditorChoice),
          status: a.status || 'published',
        });
        importedArticles++;
      }
    }
  }

  return {
    success: true,
    message: `Sinkronisasi GitHub berhasil diimpor ke Cloud SQL: ${importedMovies} film baru, ${importedVideos} video baru, ${importedArticles} artikel baru.`,
    imported: {
      movies: importedMovies,
      videos: importedVideos,
      articles: importedArticles,
    },
  };
}
