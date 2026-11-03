/**
 * RIHLE ARCHIVE - Temel Etkileşim ve Dinamik Özellikler
 * Seyyahlar Filtresi, Podcast Oynatıcı, Arama Modalı ve Tema Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbarScroll();
    initDailyQuote();
    initCategoryTabs();
    initArticleModal();
    initTravelerFilters();
    initTravelerModal();
    initPodcastPlayer();
    initBookModal();
    initSearchModal();
    initContactForm();
    initCommentForm();
    initNewsletterForm();
    initBackToTop();
    updateDateDisplay();
});

/* ===================================================================
   1. Tema Yönetimi (Karanlık Mod Kaldırıldı - Sabit Aydınlık Mod)
   =================================================================== */
function applyTheme(theme) {
    // Sadece aydınlık (light) tema
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.body.classList.remove('dark-mode');
    localStorage.removeItem('rihle-theme');
    localStorage.removeItem('theme');
    localStorage.setItem('rihle-theme', 'light');
}

function initThemeToggle() {
    // Sabit aydınlık modu uygula
    applyTheme('light');

    // Eğer eski butonlar varsa gizle veya devre dışı bırak
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle');
    toggleBtns.forEach(btn => {
        btn.style.display = 'none';
    });
}

function updateToggleIcons(theme) {
    // Tema değiştirici kaldırıldı
}

/* ===================================================================
   2. Navbar Scroll Efekti ve Aktif Link İzleme
   =================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-rihle');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    });

    // Mobil menüdeki linke tıklandığında menüyü kapat
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const collapseEl = document.getElementById('navbarRihleContent');
    if (collapseEl && window.bootstrap) {
        const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && collapseEl.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }
}

/* ===================================================================
   2.1. Ana Sayfa Kategori Sekmeleri (Resimdeki Tasarım Sekme Geçişi)
   =================================================================== */
function initCategoryTabs() {
    const tabBtns = document.querySelectorAll('.cat-tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = btn.getAttribute('data-bs-target');
            if (!targetSelector) return;

            // Nav içindeki tüm butonlardan active sınıfını kaldır
            const parentNav = btn.closest('.category-tabs-nav');
            if (parentNav) {
                parentNav.querySelectorAll('.cat-tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
            }
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // İlgili tab pane'i aktifleştir
            const targetPane = document.querySelector(targetSelector);
            if (targetPane) {
                const tabContent = targetPane.closest('.tab-content');
                if (tabContent) {
                    tabContent.querySelectorAll('.tab-pane').forEach(p => {
                        p.classList.remove('show', 'active');
                    });
                }
                targetPane.classList.add('active');
                setTimeout(() => {
                    targetPane.classList.add('show');
                }, 20);
            }
        });
    });
}

/* ===================================================================
   3. Tarih Gösterimi (Hicri ve Miladi)
   =================================================================== */
function updateDateDisplay() {
    const dateEl = document.getElementById('currentDateDisplay');
    if (!dateEl) return;
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const gregorianStr = now.toLocaleDateString('tr-TR', options);
    
    dateEl.innerHTML = `<i class="bi bi-calendar-event me-1"></i> ${gregorianStr} &bull; 19 Rebîülâhir 1448`;
}

/* ===================================================================
   3.0. Günün Seyyahı Alıntısı (Günlük Otomatik Değişen 5 Seyyah Sözü)
   =================================================================== */
const dailyQuotes = [
    {
        traveler: "İbn Battûta",
        quote: "“Türkler iyi karakterli, kuvvetli ve cesur insanlardır.”"
    },
    {
        traveler: "Evliyâ Çelebi",
        quote: "“Şefaat yâ Resûlallah diyecekken heyecandan 'Seyahat yâ Resûlallah!' dedim ve cihan kapıları bana açıldı.”"
    },
    {
        traveler: "Marco Polo",
        quote: "“Kimse bana inanmayacağı için gördüklerimin yarısını bile anlatmadım.”"
    },
    {
        traveler: "Ferdinand Magellan",
        quote: "“Kilise dünyanın düz olduğunu söylüyor; ama ben ay üzerindeki gölgesini gördüm ve kiliseden daha çok gölgeye güveniyorum.”"
    },
    {
        traveler: "Pîrî Reis",
        quote: "“Ne ilim vardır ki olsun sonu; ne insan vardır ki olmasın kusuru.”"
    }
];

function initDailyQuote() {
    const quoteEl = document.getElementById('dailyQuoteDisplay') || document.querySelector('.ticker-quote');
    if (!quoteEl) return;

    // UTC takvim günü sayısı hesaplama (her gece 00:00'da 1 artar):
    const now = new Date();
    const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / (1000 * 60 * 60 * 24));
    
    // Dizi uzunluğuna göre sırayla seçim (0, 1, 2, 3, 4 döngüsü):
    const quoteIndex = dayNumber % dailyQuotes.length;
    const selectedQuote = dailyQuotes[quoteIndex];

    quoteEl.innerHTML = `<strong>${selectedQuote.traveler}:</strong> ${selectedQuote.quote}`;
}

/* ===================================================================
   3.1. Arşivden Yazılar Veritabanı ve Modal Yönetimi
   =================================================================== */
const articlesData = [
    {
        id: 'yazi-1',
        title: "İbn Battûta'nın Anadolu Notları: Ahîler ve Misafirperverlik",
        category: "Kültür & Medeniyet",
        readTime: "6 dk okuma",
        date: "28 Ekim 2026",
        author: "Dr. Selim Yılmaz",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        excerpt: "14. yüzyıl Anadolu beylikleri coğrafyasına adım atan seyyahın, Ahî ocaklarındaki sofralar, gençlerin kardeşlik teşkilatı ve şehir hayatına dair tuttuğu eşsiz notlar.",
        content: "İbn Battûta, 1331 sonbaharında Alâiye (Alanya) limanından Anadolu kıyılarına ayak bastığında karşısında sadece dağlar ve vadiler değil, eşine rastlanmamış bir sivil dayanışma medeniyeti buldu. Ahî ocakları, seyyahları atlarından indirip konağa buyur ediyor, hiçbir ücret talep etmeksizin günlerce ağırlıyordu. Seyyah, Seyahatnâme'sinde 'Dünyada Ahîler kadar yabancıya hürmet eden, yolcuya kol kanat geren başka bir zümre görmedim' diyerek Anadolu insanının asil ruhunu tarihe emanet etmiştir."
    },
    {
        id: 'yazi-2',
        title: "Evliyâ Çelebi'nin Rüyası ve İstanbul Surları Dışındaki Hayat",
        category: "Osmanlı Tarihi",
        readTime: "8 dk okuma",
        date: "25 Ekim 2026",
        author: "Ahmet Karataş",
        image: "assets/images/evliya-celebi.jpg",
        excerpt: "Ahi Çelebi Camii'ndeki o meşhur rüya ile başlayan yarım asırlık yolculuğun ilk menzili: 17. yüzyıl payitahtının bostanları, kahvehaneleri ve Boğaziçi yalıları.",
        content: "Evliyâ Çelebi'nin Seyahatnâme'si yalnızca coğrafi bir güzergâhın değil, Osmanlı gündelik hayatının canlı bir ansiklopedisidir. Surların ötesindeki Eyüp Sultan kıyıları, Kâğıthane mesireleri ve Galata'nın çok dilli sokakları onun nüktedan kalemiyle adeta canlanır. Çelebi, dönemin yeni alışkanlığı olan kahvehaneleri, meddahları ve esnaf loncalarının geçit törenlerini benzersiz bir dille resmetmiştir."
    },
    {
        id: 'yazi-3',
        title: "Akdeniz'in Fırtınalı Sırları: Kitâb-ı Bahriye Nasıl Yazıldı?",
        category: "Denizcilik",
        readTime: "7 dk okuma",
        date: "22 Ekim 2026",
        author: "Doç. Dr. Murat K.",
        image: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=600&q=80",
        excerpt: "Pîrî Reis'in sadece haritaları değil; Akdeniz'in her koyunu, rüzgâr yönünü, su kuyularını ve kayalıklarını bir pusula hassasiyetiyle kaydettiği abidevi eseri.",
        content: "Kitâb-ı Bahriye, sadece Osmanlı donanması için bir kılavuz değil, Akdeniz kıyılarının topoğrafik, coğrafi ve stratejik bir panoramasıdır. Pîrî Reis, Gelibolu tersanesinden sefere çıktığı her limanı bizzat iskandil etmiş, derinliklerini ölçmüş ve fırtına anında gemilerin sığınabileceği doğal limanları şaşırtıcı detaylarla çizmiştir."
    },
    {
        id: 'yazi-4',
        title: "İpek Yolu Kervanlarının Günlük Hayatı: Konaklama ve Güvenlik",
        category: "Tarih & Coğrafya",
        readTime: "5 dk okuma",
        date: "19 Ekim 2026",
        author: "Zeynep Turan",
        image: "https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=600&q=80",
        excerpt: "Buhara'dan Tebriz'e uzanan kervansaraylar ağında tüccarların bir günü nasıl geçerdi? Gece nöbetleri, deve bakımları ve bedava sıcak çorba geleneği.",
        content: "Selçuklu ve Osmanlı kervansaray mimarisi, çöl ve dağ yollarında tüccarın can ve mal güvenliğini teminat altına alan bir sosyal devlet harikasıydı. Kervansaraya giren her yolcu, dinine ve milletine bakılmaksızın üç gün boyunca ücretsiz yemek, konaklama ve hekim hizmeti alırdı. Güneş batarken kapılar kilitlenir, nöbetçiler surlara çıkar ve sabah ezanına kadar kimse içeri alınmazdı."
    },
    {
        id: 'yazi-5',
        title: "İbn Fadlân'ın Kuzey Seferi: Volga Kıyısında Viking Cenazesi",
        category: "Antropoloji",
        readTime: "9 dk okuma",
        date: "15 Ekim 2026",
        author: "Kerem Aksoy",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
        excerpt: "Abbasi elçisinin 921 yılında İtil boylarında şahit olduğu gemi yakma ritüeli, Rus ve Viking kavimlerine dair dünyadaki en eski görgü tanıklığıdır.",
        content: "Bağdat'tan yola çıkıp Hazar Denizi'nin kuzeyine varan İbn Fadlân, Rus tüccarlarının bir reisi öldüğünde onun gemisiyle birlikte ateşe verildiği anı adım adım kaydetmiştir. Batılı tarihçilerin bile kendi köklerine dair başvurduğu bu Risâle, İslam ilim geleneğinin objektif gözlem gücünün en parlak örneğidir."
    },
    {
        id: 'yazi-6',
        title: "Kâtib Çelebi ve Cihannümâ: Osmanlı'da Modern Coğrafyanın Doğuşu",
        category: "Bilim Tarihi",
        readTime: "6 dk okuma",
        date: "12 Ekim 2026",
        author: "Prof. Dr. Nuri Ç.",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
        excerpt: "Batı dillerindeki Mercator ve Ortelius atlaslarını tercüme ederek Doğu coğrafyacılığıyla meczeden Hacı Halife'nin bilimsel devrimi.",
        content: "17. yüzyılın ortalarında İstanbul'da kütüphanesine kapanan Kâtib Çelebi, Doğu dünyasının coğrafya ufkunu genişletti. Latinceden Fransızcaya pek çok kaynak metni inceleyerek Cihannümâ'yı kaleme aldı ve İbrahim Müteferrika matbaasında basılan ilk resimli ve haritalı kitaplardan biri olarak tarihe geçti."
    },
    {
        id: 'yazi-7',
        title: "Endülüs'ten Semerkant'a: İlim Seyahatlerinin (Rihle) Felsefesi",
        category: "Düşünce Tarihi",
        readTime: "7 dk okuma",
        date: "08 Ekim 2026",
        author: "Dr. Selim Yılmaz",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        excerpt: "Klasik İslam dünyasında 'Rihle fi talebi'l-ilm' geleneği; bilginin peşinde binlerce kilometre yürüyen âlimlerin yol ahlakı.",
        content: "Bir hadisin doğruluğunu tahkik etmek veya bir üstattan icazet almak için Kurtuba'dan Bağdat'a yayan giden âlimler, seyahati sadece mekânsal bir yer değiştirme değil, nefsin ve aklın terbiyesi olarak gördüler. Rihle, Doğulu aydının dünyayı anlama metoduydu."
    },
    {
        id: 'yazi-8',
        title: "Marco Polo Hanbalık'ta: Kubilay Han'ın Sarayı ve Kağıt Para",
        category: "Uzak Doğu",
        readTime: "8 dk okuma",
        date: "04 Ekim 2026",
        author: "Ahmet Karataş",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        excerpt: "Venedikli tüccarın Çin sarayında gördüğü maden kömürü, posta teşkilatı ve dut ağacı kabuğundan basılan kağıt paraya dair Avrupa'yı şoke eden kayıtları.",
        content: "Marco Polo Avrupa'ya döndüğünde anlattıklarına kimse inanmak istemedi. Altın ve gümüş yerine damgalı kâğıt parçalarıyla alışveriş yapıldığını, siyah taşların (kömür) odun gibi yandığını söylediğinde ona 'Milyoncu' lakabı takılmıştı. Oysa o, çağının en gelişmiş ekonomik sistemine şahit olmuştu."
    },
    {
        id: 'yazi-9',
        title: "Kâbe Yolları: Hac Kervanlarının Rotaları ve Surre Alayları",
        category: "Kutsal Coğrafya",
        readTime: "6 dk okuma",
        date: "30 Eylül 2026",
        author: "Kerem Aksoy",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        excerpt: "Üsküdar'dan dualarla uğurlanan develer, Şam ve Kahire menzilleri üzerinden çölü aşan Hac kafilesinin asırlık hikâyesi.",
        content: "Surre-i Hümâyun, her yıl İstanbul'dan Haremeyn fukarasına ve kabile reislerine hediyeler götüren büyük bir devlet merasimiydi. Yolda kuyu başları emniyete alınır, su testileri taşınır ve binlerce hacı adayı çölün kum fırtınalarına karşı omuz omuza yürürdü."
    },
    {
        id: 'yazi-10',
        title: "Matrakçı Nasuh'un Minyatürlerinde 16. Yüzyıl Osmanlı Şehirleri",
        category: "Sanat & Harita",
        readTime: "5 dk okuma",
        date: "26 Eylül 2026",
        author: "Zeynep Turan",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        excerpt: "Irakeyn Seferi menzilnamelerinde Diyarbakır, Tebriz, Halep ve Bağdat'ı kuşbakışı resmeden dâhi nakkaşın topografik mirası.",
        content: "Matrakçı Nasuh, Kanunî'nin doğu seferi sırasında ordunun konakladığı her kaleyi, köprüyü ve nehir yatağını minyatürlerinde bir mimari plan hassasiyetiyle çizmiştir. İnsan figürü olmaksızın sadece binaları ve doğayı resmettiği bu tarz, dünya haritacılık tarihinde eşsizdir."
    },
    {
        id: 'yazi-11',
        title: "Seydi Ali Reis ve Mir'âtü'l-Memâlik: Okyanus Fırtınalarından Hindistan'a",
        category: "Denizcilik",
        readTime: "8 dk okuma",
        date: "21 Eylül 2026",
        author: "Doç. Dr. Murat K.",
        image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
        excerpt: "Hint Okyanusu'nda fırtınaya yakalanıp gemilerini kaybeden Osmanlı kaptanının Gujarat'tan Semerkant ve İstanbul'a yaya dönüş macerası.",
        content: "Mir'âtü'l-Memâlik (Memleketlerin Aynası), Türk edebiyatının ilk gezi hatıratı kabul edilir. Basra Körfezi'nden çıkıp muson fırtınasıyla Hindistan'a sürüklenen Seydi Ali Reis, Hümâyun Şah'ın sarayında şairliğiyle saygı görmüş ve karayoluyla Orta Asya'yı aşarak payitahta dönmüştür."
    },
    {
        id: 'yazi-12',
        title: "Kadim İskenderiye Feneri'nden Boğaz Kalelerine: Liman Şehirleri",
        category: "Şehir Tarihi",
        readTime: "6 dk okuma",
        date: "16 Eylül 2026",
        author: "Prof. Dr. Nuri Ç.",
        image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
        excerpt: "Doğu Akdeniz'in ticaret limanlarında tüccar kalyonları, gümrük hanları ve seyyahların kaydettiği kozmopolit sahil hayatı.",
        content: "İskenderiye, Beyrut, İzmir ve Trabzon limanları; dillerin, malların ve fikirlerin kaynaştığı kavşak noktalarıydı. Seyyahlar bu limanlarda sadece baharat ve ipek değil; Doğu ile Batı arasındaki kültürel alışverişin nabzını tuttular."
    }
];

function initArticleModal() {
    const articleBtns = document.querySelectorAll('.btn-yazi-detail');
    const modalEl = document.getElementById('articleDetailModal');
    if (!modalEl) return;

    articleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const yaziId = btn.getAttribute('data-id');
            const data = articlesData.find(a => a.id === yaziId);
            if (!data) return;

            const titleEl = document.getElementById('modalArticleTitle');
            const catEl = document.getElementById('modalArticleCategory');
            const authorEl = document.getElementById('modalArticleAuthor');
            const dateEl = document.getElementById('modalArticleDate');
            const readTimeEl = document.getElementById('modalArticleReadTime');
            const imgEl = document.getElementById('modalArticleImg');
            const contentEl = document.getElementById('modalArticleContent');

            if (titleEl) titleEl.textContent = data.title;
            if (catEl) catEl.textContent = data.category;
            if (authorEl) authorEl.textContent = data.author;
            if (dateEl) dateEl.textContent = data.date;
            if (readTimeEl) readTimeEl.textContent = data.readTime;
            if (imgEl) imgEl.src = data.image;
            if (contentEl) contentEl.textContent = data.content;

            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        });
    });
}

/* ===================================================================
   4. Seyyahlar (Travelers) Veritabanı ve Filtreleme
   =================================================================== */
const travelersData = [
    {
        id: 'ibn-battuta',
        name: 'İbn Battûta',
        period: '14. Yüzyıl (1304 - 1369)',
        century: '14. Yüzyıl',
        origin: 'Tanca, Fas',
        category: 'islam-dogu',
        route: 'Kuzey Afrika &bull; Hicaz &bull; Anadolu &bull; Altın Orda &bull; Hindistan &bull; Çin',
        totalDistance: '120.000+ Kilometre (30 Yıl)',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        excerpt: 'İslam dünyasından Çin seddine kadar 30 yıl boyunca bilinen dünyanın neredeyse tamamını adımlamış, çağının en büyük seyyahı.',
        bio: 'Muhammed bin Abdullah İbn Battûta, 1325 yılında 21 yaşındayken Hac niyetiyle yola çıkmış; ancak seyahat tutkusu onu 30 yıl boyunca Afrika, Orta Doğu, Anadolu, Kırım, Hindistan, Maldivler ve Çin’e kadar götürmüştür. Döndüğünde vezir İbn Cüzeyy’e seyahatnamesini (Tuhfetü’n-Nuzzâr) yazdırmıştır.',
        famousQuote: '“Gezmek sana önce sözcükleri unutturur, sonra da seni bir anlatıcıya dönüştürür.”',
        majorWork: 'Tuhfetü’n-Nuzzâr fî Garâ’ibi’l-Emsâr ve Acâ’ibi’l-Efsâr (İbn Battûta Seyahatnamesi)'
    },
    {
        id: 'evliya-celebi',
        name: 'Evliyâ Çelebi',
        period: '17. Yüzyıl (1611 - 1682)',
        century: '17. Yüzyıl',
        origin: 'İstanbul, Osmanlı',
        category: 'osmanli',
        route: 'İstanbul &bull; Anadolu &bull; Balkanlar &bull; Avusturya &bull; Kırım &bull; Mısır &bull; Hicaz',
        totalDistance: '50 Yıl Boyunca 7 İklim, 18 Padişahlık',
        image: 'assets/images/evliya-celebi.jpg',
        excerpt: '“Seyahat yâ Resûlallah!” nidasıyla rüyasında başladığı yolculuğunu 10 ciltlik abidevi Seyahatnâme ile ölümsüzleştiren Osmanlı dehası.',
        bio: 'Saray terbiyesi almış, nüktedan, musikişinas, hattat ve usta bir gözlemci olan Evliya Çelebi; 17. yüzyıl Osmanlı coğrafyasının sosyal hayatını, dillerini, mutfağını, folklorunu benzersiz bir edebi üslupla kaydetmiştir.',
        famousQuote: '“Şefaat yâ Resûlallah diyecekken heyecandan ‘Seyahat yâ Resûlallah’ dedim ve cihan kapıları bana açıldı.”',
        majorWork: 'Seyahatnâme (10 Cilt)'
    },
    {
        id: 'piri-reis',
        name: 'Pîrî Reis',
        period: '15-16. Yüzyıl (1465 - 1554)',
        century: '16. Yüzyıl',
        origin: 'Gelibolu, Osmanlı',
        category: 'denizci',
        route: 'Tüm Akdeniz Kıyıları &bull; Atlas Okyanusu &bull; Kızıldeniz &bull; Basra Körfezi',
        totalDistance: 'Akdeniz’in Her Limanı ve Adımı',
        image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Çizdiği 1513 tarihli dünya haritası ve Akdeniz kılavuzu Kitâb-ı Bahriye ile denizcilik tarihine adını altın harflerle kazıyan büyük amiral.',
        bio: 'Osmanlı denizcisi, haritacı ve coğrafyacı. Amcası Kemal Reis ile başladığı korsanlık ve donanma serüveninde Akdeniz’in en kuytu limanlarını, sığlıklarını, rüzgârlarını ve kalelerini haritalamış, Amerika kıtasını şaşırtıcı bir doğrulukla kağıda aktarmıştır.',
        famousQuote: '“Ey denizci, bil ki pusula ve harita olmadan Akdeniz’in dalgası bile affetmez.”',
        majorWork: 'Kitâb-ı Bahriye & 1513 ve 1528 Dünya Haritaları'
    },
    {
        id: 'katip-celebi',
        name: 'Kâtib Çelebi (Hacı Halife)',
        period: '17. Yüzyıl (1609 - 1657)',
        century: '17. Yüzyıl',
        origin: 'İstanbul, Osmanlı',
        category: 'osmanli',
        route: 'Doğu Seferleri &bull; Bağdat &bull; Halep &bull; Erzurum &bull; Kütüphaneler',
        totalDistance: 'Zihinsel ve Coğrafi Muazzam Külliyat',
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Cihannümâ eseriyle Doğu ve Batı coğrafya ilmini harmanlayan, Osmanlı’nın ilk modern dünya atlası yazarı ve ansiklopedisti.',
        bio: 'Osmanlı ordusunda kâtiplik yaparak seferlere katılmış, ardından kendini kitaplara adamıştır. Batı dillerindeki coğrafya atlaslarını tercüme ederek Doğu kaynaklarıyla birleştirmiş, İslam coğrafyacılığını yeni bir boyuta taşımıştır.',
        famousQuote: '“İlim bir denizdir, coğrafya ise bu denizde kaybolmamanın yegane haritasıdır.”',
        majorWork: 'Cihannümâ & Keşfü’z-Zunûn'
    },
    {
        id: 'ibn-fadlan',
        name: 'İbn Fadlân',
        period: '10. Yüzyıl (y. 921 - 922)',
        century: '10. Yüzyıl',
        origin: 'Bağdat, Abbasi Hilafeti',
        category: 'islam-dogu',
        route: 'Bağdat &bull; Rey &bull; Buhara &bull; Harezm &bull; Volga Bulgarları &bull; İtil',
        totalDistance: '5.000+ Kilometre (Kuzey Bozkırları)',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Abbasi Halifesinin elçisi olarak İtil (Volga) Bulgarlarına giden, Vikingler (Ruslar) ve Türk boyları hakkında tarihin ilk detaylı etnografik kaydını tutan elçi seyyah.',
        bio: '921 yılında Bağdat’tan yola çıkarak Orta Asya bozkırlarını, Oğuz, Peçenek ve Başkırt Türklerini bizzat gözlemlemiş; İtil boylarındaki Viking cenaze törenlerini ve yaşam tarzlarını ilk kez batı dünyasına aktarmıştır.',
        famousQuote: '“Kuzeyin buz kesen rüzgarlarında gördüklerim, Bağdat kütüphanelerindeki bin kitaptan daha çarpıcıydı.”',
        majorWork: 'İbn Fadlân Seyahatnamesi (Risâle)'
    },
    {
        id: 'marco-polo',
        name: 'Marco Polo',
        period: '13-14. Yüzyıl (1254 - 1324)',
        century: '13. Yüzyıl',
        origin: 'Venedik Cumhuriyeti',
        category: 'dogu-ipekyolu',
        route: 'Venedik &bull; Trabzon &bull; Tebriz &bull; Pamir Dağları &bull; Pekin (Hanbalık) &bull; Hint Okyanusu',
        totalDistance: '24 Yıllık Doğu Serüveni',
        image: 'https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=800&q=80',
        excerpt: 'İpek Yolu üzerinden Kubilay Han’ın Moğol sarayına ulaşan ve Avrupa’ya Doğu Asya’nın ihtişamını, porselenini ve barutunu tanıtan Venedikli tüccar seyyah.',
        bio: 'Babası ve amcasıyla çıktığı ticaret yolculuğunda 17 yıl Kubilay Han’ın hizmetinde kalmış, Çin’in farklı eyaletlerini yönetmiş ve dönüşünde Ceneviz hapishanesindeyken hatıralarını Rustichello da Pisa’ya dikte ettirmiştir.',
        famousQuote: '“Gördüklerimin ancak yarısını anlattım, çünkü anlatsaydım kimse inanmazdı.”',
        majorWork: 'İl Milione (Dünyanın Tasviri)'
    },
    {
        id: 'el-mesudi',
        name: 'El-Mes‘ûdî',
        period: '10. Yüzyıl (896 - 956)',
        century: '10. Yüzyıl',
        origin: 'Bağdat, Abbasi Hilafeti',
        category: 'islam-dogu',
        route: 'Bağdat &bull; İran &bull; Hindistan &bull; Seylan &bull; Umman &bull; Hazar Kıyıları &bull; Şam &bull; Kahire',
        totalDistance: 'On Binlerce Kilometre (Akdeniz’den Hint Okyanusu’na)',
        image: 'assets/images/el-mesudi.jpg',
        excerpt: '“İslam’ın Herodot’u” olarak anılan büyük seyyah; 4 ciltlik abidevi eseri “Altın Bozkırlar ve Mücevher Madenleri” (Mürûcü’z-Zeheb) ile kadim medeniyetleri kaydetti.',
        bio: 'Ebü’l-Hasan Ali b. el-Hüseyin el-Mes‘ûdî, İslam tarih ve coğrafya yazıcılığının zirve isimlerindendir ve "İslam’ın Herodot’u" olarak anılır. Bağdat’tan başladığı seyahatlerinde İran, Hindistan, Seylan, Umman, Hazar Denizi ve Doğu Afrika’ya kadar uzanmıştır. 4 ciltlik meşhur eseri Mürûcü’z-Zeheb ve Me‘âdinü’l-Cevher (Altın Bozkırlar ve Mücevher Madenleri), kadim milletlerin tarihini, inançlarını ve coğrafyasını bir araya getiren eşsiz bir ansiklopedidir.',
        famousQuote: '“Gezip görmediği yerleri sadece kitaplardan anlatan kimse; bizzat yola çıkan ve hakikati kendi gözleriyle müşahede eden seyyah gibi olamaz.”',
        majorWork: 'Mürûcü’z-Zeheb ve Me‘âdinü’l-Cevher (Altın Bozkırlar ve Mücevher Madenleri - 4 Cilt)'
    }
];

function initTravelerFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.seyyah-item-col');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initTravelerModal() {
    const detailBtns = document.querySelectorAll('.btn-seyyah-detail');
    const modalEl = document.getElementById('travelerDetailModal');
    if (!modalEl) return;

    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const travelerId = btn.getAttribute('data-id');
            const data = travelersData.find(item => item.id === travelerId);
            if (!data) return;

            document.getElementById('modalTravelerName').textContent = data.name;
            document.getElementById('modalTravelerPeriod').textContent = data.period;
            document.getElementById('modalTravelerOrigin').textContent = data.origin;
            document.getElementById('modalTravelerRoute').innerHTML = data.route;
            document.getElementById('modalTravelerDist').textContent = data.totalDistance;
            document.getElementById('modalTravelerBio').textContent = data.bio;
            document.getElementById('modalTravelerQuote').textContent = data.famousQuote;
            document.getElementById('modalTravelerWork').textContent = data.majorWork;
            document.getElementById('modalTravelerImg').src = data.image;

            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        });
    });
}

/* ===================================================================
   5. Podcast Oynatıcı Widget'ı
   =================================================================== */
const podcastEpisodes = [
    {
        id: 1,
        title: "İbn Battûta'nın 30 Yıllık Yolculuğu: Tanca'dan Çin'e",
        guest: "Prof. Dr. Ahmet Şimşirgil ile",
        duration: "42 dk",
        date: "24 Ekim 2026",
        cover: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
        desc: "İbn Battûta'nın Tanca'dan tek başına çıkıp 120 bin kilometrelik dünya seyahatine dönüşen macerasının bilinmeyen detayları."
    },
    {
        id: 2,
        title: "Evliyâ Çelebi'nin Gözünden 17. Yüzyıl İstanbul'u",
        guest: "Dr. Mehmet Kalpaklı ile",
        duration: "38 dk",
        date: "17 Ekim 2026",
        cover: "assets/images/evliya-celebi.jpg",
        desc: "Kahvehaneler, esnaf alayları, kayıkçılar ve dönemin sokak Türkçesi. Evliyâ'nın mizah yüklü diliyle payitaht günleri."
    },
    {
        id: 3,
        title: "Kitâb-ı Bahriye: Pîrî Reis'in Akdeniz Sırları",
        guest: "Prof. Dr. İdris Bostan ile",
        duration: "45 dk",
        date: "10 Ekim 2026",
        cover: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=400&q=80",
        desc: "1513 Haritası nasıl çizildi? Akdeniz limanlarının topoğrafik kayıtları ve Osmanlı korsan denizciliğinin altın çağı."
    },
    {
        id: 4,
        title: "İpek Yolu Kervanlarının Bilinmeyen Günlükleri",
        guest: "Arş. Gör. Zeynep Turan ile",
        duration: "34 dk",
        date: "03 Ekim 2026",
        cover: "https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=400&q=80",
        desc: "Kervansaray teşkilatı, tüccarların yol güvenliği ve çölleri aşan kervanların günlük beslenme ve konaklama ritüelleri."
    }
];

let isPlaying = false;
let currentProgress = 32;
let progressInterval = null;

function initPodcastPlayer() {
    const playBtn = document.getElementById('masterPlayBtn');
    const playIcon = document.getElementById('masterPlayIcon');
    const progressBar = document.getElementById('playerProgressBar');
    const progressFill = document.getElementById('playerProgressFill');
    const currentTimeEl = document.getElementById('playerCurrentTime');
    const podcastItems = document.querySelectorAll('.podcast-item');

    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.className = 'bi bi-pause-fill';
            startProgressTicker(progressFill, currentTimeEl);
        } else {
            playIcon.className = 'bi bi-play-fill';
            clearInterval(progressInterval);
        }
    });

    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            currentProgress = newPct;
            progressFill.style.width = `${newPct}%`;
        });
    }

    podcastItems.forEach(item => {
        item.addEventListener('click', () => {
            const epId = parseInt(item.getAttribute('data-id'), 10);
            const ep = podcastEpisodes.find(p => p.id === epId);
            if (!ep) return;

            podcastItems.forEach(i => i.classList.remove('is-active'));
            item.classList.add('is-active');

            // Player alanını güncelle
            document.getElementById('playerTitle').textContent = ep.title;
            document.getElementById('playerGuest').textContent = ep.guest;
            document.getElementById('playerCover').src = ep.cover;
            
            // Sıfırla ve başlat
            currentProgress = 0;
            progressFill.style.width = '0%';
            isPlaying = true;
            playIcon.className = 'bi bi-pause-fill';
            startProgressTicker(progressFill, currentTimeEl);
        });
    });
}

function startProgressTicker(progressFill, currentTimeEl) {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (currentProgress >= 100) {
            currentProgress = 0;
            clearInterval(progressInterval);
            const playIcon = document.getElementById('masterPlayIcon');
            if (playIcon) playIcon.className = 'bi bi-play-fill';
            isPlaying = false;
        } else {
            currentProgress += 0.5;
            progressFill.style.width = `${currentProgress}%`;
            
            // Dakika göstergesi hesabı
            const totalSec = 42 * 60;
            const currentSec = Math.floor((currentProgress / 100) * totalSec);
            const m = Math.floor(currentSec / 60);
            const s = currentSec % 60;
            if (currentTimeEl) {
                currentTimeEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
            }
        }
    }, 1000);
}

/* ===================================================================
   6. Kitap Önerileri Modalı
   =================================================================== */
const booksData = [
    {
        id: 'seyahatname-evliya',
        title: 'Evliya Çelebi Seyahatnâmesi (Kısaltılmış Basım)',
        author: 'Evliyâ Çelebi (Sadeleştiren: Dr. Mümin Çevik)',
        publisher: 'Bilge Kültür Sanat',
        pages: '512 Sayfa',
        rating: '5.0',
        cover: 'assets/images/evliya-celebi-seyahatnamesi-bilge.jpg',
        desc: '17. yüzyıl Osmanlı coğrafyasının en büyük anıtı. Dr. Mümin Çevik tarafından sadeleştirilerek kısaltılmış basımı hazırlanan eser; dönemin şehirlerini, halk inançlarını, esnaf teşkilatlarını ve mimarisini eşsiz bir dille aktarır.',
        quote: '“Gez dünyayı, gör Konya’yı derlerdi; ben ise yedi iklimi dolaştım ve her köşe başında insanlığın farklı bir tebessümünü buldum.”'
    },
    {
        id: 'ibn-battuta-kitap',
        title: 'İbn Battûta Seyahatnâmesi (Yaşantı)',
        author: 'Ebû Abdullah Muhammed İbn Battûta Tancî (Çeviren: A. Sait Aykut)',
        publisher: 'Yapı Kredi Yayınları (YKY)',
        pages: '1120 Sayfa (2 Cilt)',
        rating: '4.9',
        cover: 'assets/images/ibn-battuta-seyahatnamesi-yky.jpg',
        desc: 'Orta Çağ İslam dünyasının, Anadolu beyliklerinin, Afrika kabilelerinin ve Hanbalık (Pekin) sarayının en canlı tanıklığı. A. Sait Aykut’un titiz notları ve çevirisiyle Yapı Kredi Yayınları Yaşantı dizisinden yayımlanmış abidevi bir seyahat şaheseri.',
        quote: '“Anadolu’da nereye varsak, Ahîler bizi kendi evlatları gibi karşılar, sofralarını son lokmalarına dek önümüze sererlerdi.”'
    },
    {
        id: 'afrikali-leo',
        title: 'Afrikalı Leo',
        author: 'Amin Maalouf (Çeviren: Sevim Raşa)',
        publisher: 'Yapı Kredi Yayınları (YKY)',
        pages: '364 Sayfa (45. Baskı)',
        rating: '4.9',
        cover: 'assets/images/afrikali-leo-amin-maalouf-yky.jpg',
        desc: 'Hasan el-Vezzan’ın (Afrikalı Leo) Granada’dan Fez’e, Kahire’den Roma’ya uzanan sürgün, seyahat ve Akdeniz serüveni. İki dinin, iki dünyanın ve iki kıyının kesişimindeki bir seyyahın romanı.',
        quote: '“Ben ne bir yabancıyım ne de bir yerli; ben iki kıyının da çocuğuyum. Akdeniz benim vatanım, yollar ise evimdir.”'
    },
    {
        id: 'dogu-bati-arasinda',
        title: 'Afrikalı Leo',
        author: 'Amin Maalouf (Çeviren: Sevim Raşa)',
        publisher: 'Yapı Kredi Yayınları (YKY)',
        pages: '364 Sayfa (45. Baskı)',
        rating: '4.9',
        cover: 'assets/images/afrikali-leo-amin-maalouf-yky.jpg',
        desc: 'Hasan el-Vezzan’ın (Afrikalı Leo) Granada’dan Fez’e, Kahire’den Roma’ya uzanan sürgün, seyahat ve Akdeniz serüveni. İki dinin, iki dünyanın ve iki kıyının kesişimindeki bir seyyahın romanı.',
        quote: '“Ben ne bir yabancıyım ne de bir yerli; ben iki kıyının da çocuğuyum. Akdeniz benim vatanım, yollar ise evimdir.”'
    },
    {
        id: 'ibn-fadlan-kitap',
        title: 'İbn Fadlân Seyahatnamesi',
        author: 'İbn Fadlân (Çeviren / Hazırlayan: Prof. Dr. Ramazan Şeşen)',
        publisher: 'Yeditepe Yayınevi (13. Baskı)',
        pages: '160 Sayfa',
        rating: '4.8',
        cover: 'assets/images/ibn-fadlan-seyahatnamesi-yeditepe.jpg',
        desc: 'İtil (Volga) Bulgarları, erken dönem Türk boyları ve kuzey kavimlerine dair dünyadaki en eski ve en güvenilir gözlemler. Bağdat hilafet merkezinden kuzey bozkırlarına uzanan tarihi bir elçilik raporu.',
        quote: '“Geceleri gökyüzünde parıldayan o kızıl ışıklar altında kuzey insanlarının şarkılarını dinledik.”'
    },
    {
        id: 'hans-dernschwam',
        title: 'İstanbul ve Anadolu’ya Seyahat Günlüğü (1553-1555)',
        author: 'Hans Dernschwam',
        publisher: 'Dorlion Yayınları (Anı Dizisi)',
        pages: '448 Sayfa',
        rating: '4.8',
        cover: 'assets/images/hans-dernschwam-seyahat-gunlugu-dorlion.jpg',
        desc: 'Kanuni Sultan Süleyman devrinde Habsburg elçilik heyetiyle İstanbul ve Anadolu\'yu adım adım gezen Dernschwam\'ın tuttuğu günlükler; 16. yüzyıl Osmanlı şehirleri, hanları, yolları ve toplumsal dokusu üzerine paha biçilmez bir tanıklıktır.',
        quote: '“İstanbul’un çarşıları ve kervansarayları, dünyanın dört bir köşesinden gelen tüccarlarla bir deniz gibi dalgalanıyordu.”'
    },
    {
        id: 'katip-celebi',
        title: 'İstanbul ve Anadolu’ya Seyahat Günlüğü (1553-1555)',
        author: 'Hans Dernschwam',
        publisher: 'Dorlion Yayınları (Anı Dizisi)',
        pages: '448 Sayfa',
        rating: '4.8',
        cover: 'assets/images/hans-dernschwam-seyahat-gunlugu-dorlion.jpg',
        desc: 'Kanuni Sultan Süleyman devrinde Habsburg elçilik heyetiyle İstanbul ve Anadolu\'yu gezen Hans Dernschwam\'ın 16. yüzyıl Osmanlı coğrafyası üzerine ayrıntılı gözlemleri.',
        quote: '“İstanbul’un çarşıları ve kervansarayları, dünyanın dört bir köşesinden gelen tüccarlarla bir deniz gibi dalgalanıyordu.”'
    },
    {
        id: 'vambery-kitap',
        title: 'Bir Sahte Dervişin Orta Asya Gezisi (-1832-)',
        author: 'Arminius Vambery',
        publisher: 'Dorlion Yayınları (Anı Dizisi)',
        pages: '384 Sayfa',
        rating: '4.8',
        cover: 'assets/images/arminius-vambery-sahte-dervis-dorlion.jpg',
        desc: '19. yüzyılda derviş kılığına bürünerek Osmanlı topraklarından İran, Hive ve Buhara hanlıklarına uzanan Macar oryantalistin macera dolu, sürükleyici hatıraları.',
        quote: '“Reşit Efendi adıyla bir derviş cübbesi içinde çölleri aştım; kimse bir Avrupalı olduğumu fark etmedi.”'
    }
];

function initBookModal() {
    const bookBtns = document.querySelectorAll('.btn-book-detail');
    const modalEl = document.getElementById('bookDetailModal');
    if (!modalEl) return;

    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookId = btn.getAttribute('data-id');
            const data = booksData.find(b => b.id === bookId);
            if (!data) return;

            document.getElementById('modalBookTitle').textContent = data.title;
            document.getElementById('modalBookAuthor').textContent = data.author;
            document.getElementById('modalBookPublisher').textContent = data.publisher;
            document.getElementById('modalBookPages').textContent = data.pages;
            document.getElementById('modalBookDesc').textContent = data.desc;
            document.getElementById('modalBookQuote').textContent = data.quote;
            document.getElementById('modalBookCover').src = data.cover;

            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        });
    });
}

/* ===================================================================
   7. Hızlı Arama Modalı (CTRL/CMD + K)
   =================================================================== */
function initSearchModal() {
    const searchModalEl = document.getElementById('searchArchiveModal');
    const searchInput = document.getElementById('archiveSearchInput');
    const searchResults = document.getElementById('archiveSearchResults');
    if (!searchModalEl || !searchInput) return;

    const bsModal = new bootstrap.Modal(searchModalEl);

    // Kısayol Tuşu (Ctrl + K veya Cmd + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            bsModal.show();
            setTimeout(() => searchInput.focus(), 300);
        }
    });

    // Butonla açıldığında focus
    searchModalEl.addEventListener('shown.bs.modal', () => {
        searchInput.focus();
    });

    // Arama filtrelemesi
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = `
                <div class="p-4 text-center text-muted">
                    <i class="bi bi-search fs-2 mb-2 d-block"></i>
                    Aramak istediğiniz seyyah, kitap veya podcast başlığını yazın...
                </div>
            `;
            return;
        }

        // Yazılarda ara
        const matchedArticles = articlesData.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.excerpt.toLowerCase().includes(query) ||
            a.author.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query)
        );

        // Seyyahlarda ara
        const matchedTravelers = travelersData.filter(t => 
            t.name.toLowerCase().includes(query) || 
            t.bio.toLowerCase().includes(query) ||
            t.origin.toLowerCase().includes(query)
        );

        // Kitaplarda ara
        const matchedBooks = booksData.filter(b => 
            b.title.toLowerCase().includes(query) || 
            b.author.toLowerCase().includes(query)
        );

        // Podcastlerde ara
        const matchedPodcasts = podcastEpisodes.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.guest.toLowerCase().includes(query)
        );

        let html = '';

        if (matchedArticles.length === 0 && matchedTravelers.length === 0 && matchedBooks.length === 0 && matchedPodcasts.length === 0) {
            html = `
                <div class="p-4 text-center text-muted">
                    <i class="bi bi-question-circle fs-2 mb-2 d-block text-terracotta"></i>
                    "${query}" için arşivde eşleşen bir kayıt bulunamadı.
                </div>
            `;
        } else {
            if (matchedArticles.length > 0) {
                html += `<div class="px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small">Arşivden Yazılar</div>`;
                matchedArticles.forEach(a => {
                    html += `
                        <a href="yazilar.html" class="search-result-item" data-bs-dismiss="modal">
                            <i class="bi bi-journal-text text-terracotta fs-5"></i>
                            <div>
                                <div class="fw-bold">${a.title}</div>
                                <div class="small text-muted">${a.category} &bull; ${a.author}</div>
                            </div>
                        </a>
                    `;
                });
            }
            if (matchedTravelers.length > 0) {
                html += `<div class="px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small">Seyyahlar</div>`;
                matchedTravelers.forEach(t => {
                    html += `
                        <a href="seyyahlar.html" class="search-result-item" data-bs-dismiss="modal">
                            <i class="bi bi-compass text-terracotta fs-5"></i>
                            <div>
                                <div class="fw-bold">${t.name}</div>
                                <div class="small text-muted">${t.period} - ${t.origin}</div>
                            </div>
                        </a>
                    `;
                });
            }

            if (matchedPodcasts.length > 0) {
                html += `<div class="px-3 pt-3 pb-1 text-uppercase text-muted fw-bold small">Podcast Yayınları</div>`;
                matchedPodcasts.forEach(p => {
                    html += `
                        <a href="podcast.html" class="search-result-item" data-bs-dismiss="modal">
                            <i class="bi bi-mic text-terracotta fs-5"></i>
                            <div>
                                <div class="fw-bold">${p.title}</div>
                                <div class="small text-muted">${p.guest} &bull; ${p.duration}</div>
                            </div>
                        </a>
                    `;
                });
            }

            if (matchedBooks.length > 0) {
                html += `<div class="px-3 pt-3 pb-1 text-uppercase text-muted fw-bold small">Kitap Önerileri</div>`;
                matchedBooks.forEach(b => {
                    html += `
                        <a href="kitap-onerileri.html" class="search-result-item" data-bs-dismiss="modal">
                            <i class="bi bi-book text-terracotta fs-5"></i>
                            <div>
                                <div class="fw-bold">${b.title}</div>
                                <div class="small text-muted">${b.author}</div>
                            </div>
                        </a>
                    `;
                });
            }
        }

        searchResults.innerHTML = html;
    });
}

/* ===================================================================
   8. İletişim Formu ve Bildirim Toast'u
   =================================================================== */
function initContactForm() {
    const form = document.getElementById('rihleContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const nameInput = document.getElementById('contactName');
        const name = nameInput ? nameInput.value : 'Okurumuz';

        showToast(`Teşekkürler, ${name}! Mesajınız Rihle Archive editör heyetine iletildi.`);
        form.reset();
        form.classList.remove('was-validated');
    });
}

function initCommentForm() {
    const commentForm = document.getElementById('commentform');
    if (!commentForm) return;

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const authorInput = document.getElementById('author');
        const commentInput = document.getElementById('comment');
        if (!authorInput || !commentInput) return;

        const authorName = authorInput.value.trim();
        const commentText = commentInput.value.trim();

        if (!authorName || !commentText) return;

        // Yeni yorum öğesini oluşturup listeye ekle
        const commentList = document.querySelector('.comment-list');
        if (commentList) {
            const initial = authorName.charAt(0).toUpperCase();
            const newLi = document.createElement('li');
            newLi.className = 'comment-item';
            newLi.innerHTML = `
                <div class="d-flex gap-3">
                    <div class="comment-avatar">${initial}</div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="comment-author-name">${authorName}</h5>
                            <span class="comment-date"><i class="bi bi-clock me-1"></i> Az önce</span>
                        </div>
                        <p class="comment-text">${commentText}</p>
                    </div>
                </div>
            `;
            commentList.appendChild(newLi);
        }

        showToast(`Teşekkürler ${authorName}, yorumunuz başarıyla yayımlandı.`);
        commentForm.reset();
    });
}

function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast(`E-bültenimize kaydoldunuz (${emailInput.value}). Hoş geldiniz!`);
                form.reset();
            }
        });
    });
}

function showToast(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-bg-dark border-0 show';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Kapat"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    setTimeout(() => {
        toastEl.remove();
    }, 4500);
}

/* ===================================================================
   9. Başa Dön (Back to Top) Butonu
   =================================================================== */
function initBackToTop() {
    const btn = document.getElementById('btnBackToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

