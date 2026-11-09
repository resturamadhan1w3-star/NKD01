import bcrypt from 'bcryptjs';
import { db } from './index.ts';
import {
  admins,
  websiteSettings,
  categories,
  banners,
  movies,
  videos,
  articles,
  youtubeChannels,
  instagramAccounts,
  instagramMedia,
} from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedInitialData() {
  try {
    // 1. Seed or Verify Administrator
    const existingAdmin = await db.select().from(admins).where(eq(admins.username, 'admin01')).limit(1);
    if (existingAdmin.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin01', salt);
      await db.insert(admins).values({
        username: 'admin01',
        passwordHash: hashedPassword,
        role: 'superadmin',
        mustChangePassword: true,
      });
      console.log('✓ Initial administrator created: admin01 (Password change required on first login)');
    }

    // 2. Seed Website Settings
    const initialSettings: Record<string, string> = {
      site_name: 'NGOBROL DI KANTOR',
      tagline: 'THE DARK SIDE OF EVERY STORY.',
      concept: 'Digital Mystery & Dark Entertainment Platform',
      primary_color: '#050706',
      accent_color: '#39FF14',
      logo_text: 'NGOBROL DI KANTOR',
      logo_url: '',
      contact_email: 'redaksi@ngobroldikantor.com',
      age_gate_enabled: 'true',
      about_content: `NGOBROL DI KANTOR adalah platform streaming digital dan wadah jurnalisme investigatif independen yang mengungkap sisi tergelap dari sejarah, fenomena supranatural, konspirasi global, misteri belum terpecahkan, serta investigasi ruang digital terdalam (Dark Web). Kami mendedikasikan platform ini untuk para penikmat misteri, peneliti amatir, dan pecinta horor psikologis yang mencari kebenaran di balik tabir rahasia. Seluruh konten disajikan dengan standar visual sinematik bernuansa dark horror dan neon luminescence.`,
      privacy_policy: `Privasi Anda adalah prioritas kami. Kami tidak pernah menjual data pribadi Anda ke pihak ketiga. Seluruh riwayat tontonan dan preferensi akun dienkripsi untuk kenyamanan penjelajahan Anda di platform NGOBROL DI KANTOR.`,
      terms_of_service: `Platform ini ditujukan secara eksklusif bagi pemirsa berusia 18 tahun ke atas. Konten dapat mengandung deskripsi kasus kriminal nyata, rekaman arsip sensitif, dan audio visual horor psikologis.`,
    };

    for (const [key, value] of Object.entries(initialSettings)) {
      const exist = await db.select().from(websiteSettings).where(eq(websiteSettings.key, key)).limit(1);
      if (exist.length === 0) {
        await db.insert(websiteSettings).values({ key, value });
      }
    }

    // 3. Seed Categories
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length === 0) {
      await db.insert(categories).values([
        {
          slug: 'misteri',
          name: 'Misteri Dunia',
          icon: 'Compass',
          description: 'Misteri sejarah kuno, hilangnya peradaban, dan kasus yang tak pernah terpecahkan.',
          sortOrder: 1,
        },
        {
          slug: 'konspirasi',
          name: 'Konspirasi Global',
          icon: 'ShieldAlert',
          description: 'Eksperimen rahasia pemerintah, organisasi bayangan, dan dokumen rahasia dunia.',
          sortOrder: 2,
        },
        {
          slug: 'dark-web',
          name: 'Dark Web & Cyber',
          icon: 'Terminal',
          description: 'Investigasi digital, celah internet tersembunyi, dan sindikat siber internasional.',
          sortOrder: 3,
        },
        {
          slug: 'horor',
          name: 'Horor & Urban Legend',
          icon: 'Skull',
          description: 'Kisah nyata penampakan, kutukan kuno, pesugihan, dan mitos urban Nusantara & dunia.',
          sortOrder: 4,
        },
        {
          slug: 'film',
          name: 'Film & Thriller',
          icon: 'Film',
          description: 'Koleksi film thriller psikologis, horor sinematik, dan dokumenter fiksi mendalam.',
          sortOrder: 5,
        },
        {
          slug: 'dokumenter',
          name: 'Dokumenter Kriminal',
          icon: 'FileText',
          description: 'Rekonstruksi kasus pembunuhan berantai, profil kriminal psikopat, dan penyelidikan forensik.',
          sortOrder: 6,
        },
        {
          slug: 'dark-shorts',
          name: 'Dark Shorts (9:16)',
          icon: 'Zap',
          description: 'Potongan arsip rekaman menakutkan dan teori konspirasi cepat berformat vertikal.',
          sortOrder: 7,
        },
      ]);
      console.log('✓ Categories seeded.');
    }

    // 4. Seed Banners
    const existingBanners = await db.select().from(banners);
    if (existingBanners.length === 0) {
      await db.insert(banners).values([
        {
          title: 'KASUS DYATLOV PASS: MISTERI GUNUNG KEMATIAN',
          subtitle: 'INSIDEN 1959 YANG TAK TERPECAHKAN',
          description: 'Sembilan pendaki berpengalaman tewas secara misterius di Pegunungan Ural. Tenda dirobek dari dalam, tulang patah tanpa memar luar, dan jejak radiasi yang tak masuk akal.',
          category: 'Misteri Sejarah',
          desktopImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
          mobileImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
          buttonText: 'Tonton Dokumenter',
          targetUrl: '/misteri',
          focalPoint: 'center',
          gradientOverlay: 'dark-cinematic',
          slideDuration: 6000,
          sortOrder: 1,
        },
        {
          title: 'PROJECT MKULTRA: EKSPERIMEN CUCI OTAK CIA',
          subtitle: 'DOKUMEN KLASIFIKASI TERBONGKAR',
          description: 'Penelitian rahasia yang menggunakan zat psikoaktif, isolasi ekstrem, dan hipnosis untuk memprogram ulang pikiran manusia di bawah kendali intelijen.',
          category: 'Konspirasi Dunia',
          desktopImageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1920&q=80',
          mobileImageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
          buttonText: 'Buka Dokumen',
          targetUrl: '/konspirasi',
          focalPoint: 'center',
          gradientOverlay: 'dark-cinematic',
          slideDuration: 6000,
          sortOrder: 2,
        },
        {
          title: 'MISTERI HUTAN AOKIGAHARA: SUARA DARI KEDALAMAN',
          subtitle: 'EKSPEDISI FORENSIK DAN KUTUKAN JEPANG',
          description: 'Kompas kehilangan arah di atas batuan lava magnetik. Penjelajahan malam hari di antara pepohonan lebat yang menyimpan ratusan kisah tragis tak terkatakan.',
          category: 'Horor',
          desktopImageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
          mobileImageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
          buttonText: 'Masuki Ekspedisi',
          targetUrl: '/horor',
          focalPoint: 'center',
          gradientOverlay: 'dark-cinematic',
          slideDuration: 6000,
          sortOrder: 3,
        },
      ]);
      console.log('✓ Banners seeded.');
    }

    // 5. Seed Movies
    const existingMovies = await db.select().from(movies);
    if (existingMovies.length === 0) {
      await db.insert(movies).values([
        {
          title: 'KERAMAT RUMAH LABIRIN',
          slug: 'keramat-rumah-labirin',
          synopsis: 'Sebuah tim dokumenter independen menelusuri rumah peninggalan era kolonial di pelosok Jawa Tengah yang tidak pernah tercatat di peta sipil. Semakin dalam mereka merekam lorong bawah tanah, semakin banyak pintu keluar yang hilang secara gaib.',
          genre: 'Horor Supernatural',
          releaseYear: 2024,
          durationMinutes: 104,
          ageRating: '18+',
          posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          castList: 'Reza Pratama, Maya Anggraini, Dimas Wardhana',
          director: 'Arya Wicaksono',
          isEditorChoice: true,
          isFeatured: true,
          viewsCount: 14200,
        },
        {
          title: 'CIPHER: THE RED ROOM PROTOCOL',
          slug: 'cipher-the-red-room-protocol',
          synopsis: 'Seorang analis keamanan siber menemukan server bayangan di jaringan Onion yang menyiarkan lelang sandera secara terenkripsi. Ketika dia mencoba melacak alamat IP master, koneksi listrik di rumahnya tiba-tiba terputus satu per satu.',
          genre: 'Cyber Thriller',
          releaseYear: 2024,
          durationMinutes: 98,
          ageRating: '18+',
          posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          castList: 'Rian Sastrowijoyo, Clara Tan, Erik Hansen',
          director: 'Gideon Fox',
          isEditorChoice: true,
          isFeatured: false,
          viewsCount: 8930,
        },
        {
          title: 'DEEP WATER GATE: KONSPIRASI PALUNG JAWA',
          slug: 'deep-water-gate',
          synopsis: 'Dokumenter investigatif yang membongkar anomali sonar kapal selam di kedalaman 7.000 meter Palung Jawa. Struktur logam raksasa berbentuk geometris terdeteksi terkubur di bawah sedimen lempeng tektonik.',
          genre: 'Dokumenter Misteri',
          releaseYear: 2023,
          durationMinutes: 82,
          ageRating: '18+',
          posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          castList: 'Dr. Hendra Gunawan, Sarah Jenkins',
          director: 'Marcus Sterling',
          isEditorChoice: false,
          isFeatured: true,
          viewsCount: 11450,
        },
        {
          title: 'PARASIT KONGSI GELAP',
          slug: 'parasit-kongsi-gelap',
          synopsis: 'Investigasi rahasia ritual pesugihan para elit korporat yang menumbalkan karyawan terpilih setiap pergantian tahun fiskal. Berdasarkan kesaksian mantan sekretaris eksekutif yang kini bersembunyi di luar negeri.',
          genre: 'Kriminal / Horor',
          releaseYear: 2024,
          durationMinutes: 112,
          ageRating: '18+',
          posterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          castList: 'Indra Birowo, Farida Pasha, Kenneth Cole',
          director: 'Satria Mandala',
          isEditorChoice: true,
          isFeatured: false,
          viewsCount: 19800,
        },
      ]);
      console.log('✓ Movies seeded.');
    }

    // 6. Seed Videos
    const existingVideos = await db.select().from(videos);
    if (existingVideos.length === 0) {
      await db.insert(videos).values([
        {
          title: 'Rekaman Suara Menyeramkan Anomali Radio UVB-76 "The Buzzer"',
          slug: 'uvb-76-the-buzzer',
          description: 'Sejak era Perang Dingin, frekuensi radio gelombang pendek 4625 kHz terus mentransmisikan dengungan monoton dari Rusia, sesekali menyiarkan kode nama militer misterius.',
          categorySlug: 'konspirasi',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=kYI_l0_c1q0',
          youtubeVideoId: 'kYI_l0_c1q0',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
          duration: '18:42',
          viewsCount: 34100,
          isFeatured: true,
          isTrending: true,
          isShort: false,
        },
        {
          title: 'Misteri Hilangnya Koloni Roanoke: Tulisan "CROATOAN" di Batang Pohon',
          slug: 'misteri-koloni-roanoke',
          description: 'Tahun 1590, 115 orang pemukim Inggris lenyap tanpa jejak pertempuran maupun kuburan massal. Hanya satu kata terukir di kayu pertahanan.',
          categorySlug: 'misteri',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=0k1T_mN_V3I',
          youtubeVideoId: '0k1T_mN_V3I',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          duration: '22:15',
          viewsCount: 28900,
          isFeatured: true,
          isTrending: false,
          isShort: false,
        },
        {
          title: 'Investigasi Red Room Dark Web: Mitos Urban atau Nyata?',
          slug: 'investigasi-red-room-dark-web',
          description: 'Pakar forensik digital membongkar bukti teknis di balik rumor siaran langsung penyiksaan berbayar Bitcoin dan cara penipu siber mengeksploitasi ketakutan netizen.',
          categorySlug: 'dark-web',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=4xT9_Gg3y9s',
          youtubeVideoId: '4xT9_Gg3y9s',
          thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          duration: '25:10',
          viewsCount: 45200,
          isFeatured: false,
          isTrending: true,
          isShort: false,
        },
        {
          title: 'Kutukan Nenek Moyang di Desa Penari: Pengakuan Saksi Generasi Ketiga',
          slug: 'kutukan-desa-penari-pengakuan',
          description: 'Wawancara eksklusif malam hari dengan keturunan juru kunci yang menjaga batas gaib hutan larangan di Banyuwangi.',
          categorySlug: 'horor',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=9No-FiEInLA',
          youtubeVideoId: '9No-FiEInLA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          duration: '31:05',
          viewsCount: 52100,
          isFeatured: false,
          isTrending: true,
          isShort: false,
        },
        // Shorts
        {
          title: '3 Bukti Penjara Bawah Tanah di Bawah Vatikan',
          slug: 'short-vatikan-secret',
          description: 'Arsip rahasia dan lorong terlarang yang dijaga Swiss Guard selama ratusan tahun.',
          categorySlug: 'dark-shorts',
          videoType: 'html5',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1548625361-195feee89be9?auto=format&fit=crop&w=400&q=80',
          duration: '0:58',
          viewsCount: 78200,
          isFeatured: true,
          isTrending: true,
          isShort: true,
        },
        {
          title: 'Pesan Terakhir Pilot MH370 yang Dihapus dari Transkrip',
          slug: 'short-mh370-radar',
          description: 'Anomali radar militer menunjukkan belokan tajam manual sebelum transponder dimatikan.',
          categorySlug: 'dark-shorts',
          videoType: 'html5',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80',
          duration: '0:45',
          viewsCount: 112000,
          isFeatured: true,
          isTrending: true,
          isShort: true,
        },
        {
          title: 'Ritual Darah Bangsawan di Kastil Bran Rumania',
          slug: 'short-kastil-bran',
          description: 'Ruang penyiksaan rahasia Count Dracula yang baru ditemukan di balik dinding perpustakaan.',
          categorySlug: 'dark-shorts',
          videoType: 'html5',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
          duration: '0:52',
          viewsCount: 94300,
          isFeatured: false,
          isTrending: true,
          isShort: true,
        },
      ]);
      console.log('✓ Videos seeded.');
    }

    // 7. Seed Articles
    const existingArticles = await db.select().from(articles);
    if (existingArticles.length === 0) {
      await db.insert(articles).values([
        {
          title: 'DEKLASIFIKASI DOKUMEN AREA 51: DARI U-2 HINGGA TEKNOLOGI STEALTH GRAVITASIONAL',
          slug: 'deklasifikasi-dokumen-area-51',
          summary: 'Analisis mendalam mengenai laporan resmi CIA tahun 2013 dan pengakuan whistleblower teknik reverse-engineering pesawat non-konvensional di Nevada.',
          content: `Pada Agustus 2013, setelah puluhan tahun penyangkalan resmi, Central Intelligence Agency (CIA) merilis dokumen deklasifikasi setebal 400 halaman yang secara resmi mengakui keberadaan fasilitas uji coba Area 51 di Danau Groom, Nevada.

Namun, pengakuan tersebut hanya menyentuh permukaan. Dalam investigasi mandiri yang dilakukan tim NGOBROL DI KANTOR terhadap catatan penerbangan satelit radar aperture sintetis (SAR), ditemukan anomali medan elektromagnetik berkala di kompleks hangar selatan S-4.

Menurut kesaksian fisikawan Bob Lazar pada tahun 1989, fasilitas bawah tanah tersebut menyimpan sembilan wahana terbang yang beroperasi dengan reaktor antimateri elemen 115 (Moscovium). Meskipun kalangan akademis mainstream skeptis, sintesis elemen 115 oleh ilmuwan Rusia dan Amerika di laboratorium Dubna pada 2003 membuktikan bahwa prediksi keberadaan unsur berat tersebut akurat.

Pertanyaan mendasar tetap menggantung: apakah Area 51 semata-mata pangkalan uji coba drone militer canggih, atau stasiun uji coba teknologi propulsi anti-gravitasi hasil rekayasa balik peradaban luar?`,
          category: 'Konspirasi',
          author: 'Danur S. - Redaksi Khusus',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=900&q=80',
          tags: 'area-51,alien,cia,konspirasi',
          isHeadline: true,
          isEditorChoice: true,
          viewsCount: 16800,
        },
        {
          title: 'TRANSMISI ANGKA "THE LINCOLNSHIRE POACHER": KODE RAHASIA SPIONASE DI UDARA KOSONG',
          slug: 'transmisi-angka-the-lincolnshire-poacher',
          summary: 'Mengapa stasiun radio angka gelombang pendek terus memancarkan nada synthesizer dan deretan angka perempuan mekanik selama berdekade?',
          content: `Di tengah desis statis radio gelombang pendek, tiba-tiba terdengar melodi riang lagu rakyat Inggris abad ke-18 "The Lincolnshire Poacher", disusul suara sintesis perempuan yang membacakan lima kelompok angka acak: "3-9-7-1-5... 3-9-7-1-5...".

Stasiun angka ini diyakini dioperasikan oleh dinas intelijen rahasia Inggris MI6 dari pangkalan militer RAF Akrotiri di Siprus. Dengan menggunakan cipher One-Time Pad (OTP)—satu-satunya enkripsi matematika yang terbukti secara teoritis tidak dapat dipecahkan tanpa kunci fisik—agen lapangan di seluruh Timur Tengah dan Afrika Utara dapat menerima instruksi misi tanpa meninggalkan jejak digital.

Meskipun stasiun ini mengakhiri siarannya pada 2008, muncul varian baru dengan frekuensi terenkripsi di pita amatir, membuktikan bahwa metode spionase analog tetap menjadi benteng terkuat melawan mata-mata siber modern.`,
          category: 'Misteri',
          author: 'Arga Wicaksana',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=900&q=80',
          tags: 'spionase,radio,mi6,misteri',
          isHeadline: false,
          isEditorChoice: true,
          viewsCount: 9400,
        },
        {
          title: 'ANATOMI KUTUKAN KERAJAAN SINGHASARI: KERIS EMPU GANDRING DAN KUTUKAN 7 TURUNAN',
          slug: 'kutukan-keris-empu-gandring',
          summary: 'Kisah tragis perebutan tahta di tanah Jawa yang dibasahi darah para penguasa akibat sumpah sang pandai besi sakti.',
          content: `Pada abad ke-13, Ken Arok memesan keris sakti kepada Empu Gandring untuk membunuh Tunggul Ametung, Akuwu Tumapel. Karena tidak sabar menunggu keris selesai ditempa dan dimandikan doa mistis selama satu tahun, Ken Arok menikam sang empu dengan keris setengah jadi tersebut.

Di saat sekarat, Empu Gandring mengucapkan kutukan legendaris: "Keris ini akan menuntut nyawa tujuh raja, termasuk engkau dan keturunanmu!"

Sejarah mencatat pembunuhan berantai dalam dinasti Singhasari: Ken Arok tewas oleh Anusapati, Anusapati tewas oleh Tohjaya, dan Tohjaya tewas oleh Ranggawuni. Apakah ini murni intrik politik takhta feodal, atau gelombang energi dendam okultisme yang terperangkap dalam bilah logam meteorit pamor keris tersebut?`,
          category: 'Horor',
          author: 'R. Kuncoro',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
          tags: 'sejarah,singhasari,keris,horor',
          isHeadline: false,
          isEditorChoice: false,
          viewsCount: 12500,
        },
      ]);
      console.log('✓ Articles seeded.');
    }

    // 8. Seed YouTube Channels
    const existingChannels = await db.select().from(youtubeChannels);
    if (existingChannels.length === 0) {
      await db.insert(youtubeChannels).values([
        {
          channelName: 'Ngobrol Di Kantor Official',
          channelUrl: 'https://www.youtube.com/@ngobroldikantor',
          channelId: 'UC_ngobrol_di_kantor_official',
          category: 'misteri',
          autoSync: true,
          autoPublish: 'auto',
          lastSyncedAt: new Date(),
        },
        {
          channelName: 'Investigasi Horor & Konspirasi',
          channelUrl: 'https://www.youtube.com/@mysteryarchive',
          channelId: 'UC_mystery_archive_dark',
          category: 'konspirasi',
          autoSync: true,
          autoPublish: 'review',
          lastSyncedAt: new Date(),
        },
      ]);
      console.log('✓ YouTube channels seeded.');
    }

    // 9. Seed Instagram
    const existingIg = await db.select().from(instagramAccounts);
    if (existingIg.length === 0) {
      await db.insert(instagramAccounts).values([
        {
          accountName: '@ngobroldikantor.id',
          profileUrl: 'https://instagram.com/ngobroldikantor.id',
          category: 'dark_shorts',
          status: 'active',
        },
      ]);
      await db.insert(instagramMedia).values([
        {
          accountId: 1,
          title: 'Penampakan Bayangan Hitam di Lantai 14 Gedung Tua Sudirman',
          reelUrl: 'https://www.instagram.com/reel/C3_fake_reel_1',
          caption: 'Satpam malam shift 3 merekam sosok yang berjalan menembus kaca lift darurat. Selalu cek pintu darurat kantor Anda sebelum lembur...',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
          category: 'dark_shorts',
          isPublished: true,
        },
        {
          accountId: 1,
          title: 'Transkrip Percakapan Terakhir Ruang Operasi Kasus Dokter Zombie',
          reelUrl: 'https://www.instagram.com/reel/C3_fake_reel_2',
          caption: 'Audio rekaman yang bocor dari rumah sakit terbengkalai di pinggiran Bandung tahun 2004.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&q=80',
          category: 'dark_shorts',
          isPublished: true,
        },
      ]);
      console.log('✓ Instagram media seeded.');
    }

    console.log('Database initialization & initial catalog seeding completed.');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}
