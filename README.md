# Rihle Archive - Site Misyonu ve Taslak Kılavuzu

**Site Adı:** Rihle Archive  
**Genel Amaç / Slogan:** Geçmişin izine saygı duyan, yerli ve yabancı seyyahların gözünden tarihe, kültüre ve medeniyete ışık tutan bağımsız dijital tarih ve kültür platformu.  
**İletişim:** iletisim.rihlearchive@gmail.com

---

### 1. Sitenin Temel Felsefesi ve Çerçevesi
Bu platform; tarih yazımını sadece kuru kronolojik verilerden ibaret görmeyen, geçmişe ve onun bıraktığı mirasa derin bir saygıyla yaklaşan bağımsız bir dijital arşivdir. Sitenin kalbini, geçmişte bu coğrafyalarda iz bırakmış ya da dışarıdan bu medeniyete pencere açmış **yerli ve yabancı seyyahların/gezginlerin seyahatnameleri, gözlemleri ve anıları** oluşturur. Amaç, tarihimizi ve dünya medeniyetini tek bir merkezden değil, dışarıdan bakan gözlerin ve içerideki seyyahların objektif/öznel tanıklıklarıyla harmanlayarak zengin bir perspektifle sunmaktır.

### 2. Hedef Kitle
- **Meraklı Okurlar:** Tarihe, seyahatnamelere ve ilmi araştırmalara ilgi duyan genel kitle.
- **Araştırmacılar ve Öğrenciler:** Akademik düzeyde olmasa bile nitelikli tarih okumaları yapmak isteyenler.
- **Dijital Kaşifler:** Seyahat tarihi, Osmanlı ve dünya coğrafyası seyyahları üzerine okuma yapmayı seven araştırmacı ruhlu okurlar.

---

## 🏛️ Proje Hakkında
**Rihle Archive**, klasik İslam ve Doğu medeniyetlerindeki *“Rihle”* (ilim ve keşif gayesiyle yapılan kutlu seyahatler) geleneğini modern dijital çağa taşıyan bir kültür ve tarih arşiv portalıdır. 

Yüklenen orijinal marka logosundaki kiremit/pişmiş toprak (terracotta: `#B85D38`) ve derin espresso ahşap tonları (`#221A15`), sıcak parşömen zeminler ve zarif tipografi ('Playfair Display' ve 'Cinzel') ile bütünleştirilmiştir.

---

## 🚀 Kullanılan Teknolojiler
- **HTML5**: Semantik ve modern web mimarisi
- **CSS3 & Bootstrap 5.3**: Grid sistemi, esnek kutular, özel CSS değişkenleri (CSS variables) ve animasyonlar
- **JavaScript (ES6+)**:
  - Etkileşimli Seyyah filtreleme ve dinamik biyografi modalı
  - Canlı ses oynatıcı widget'ı (Podcast player kontrolü, ilerleme çubuğu ve süre sayacı)
  - Kitap inceleme modalı
  - Canlı arama modalı (`Ctrl + K` veya arama ikonu)
  - Açık / Koyu tema (Dark Mode) desteği
  - İletişim ve e-bülten bildirimleri (Bootstrap Toast)
- **Bootstrap Icons**: Vektörel semboller ve ikonlar
- **Google Fonts**: *Playfair Display*, *Cinzel* ve *Plus Jakarta Sans*

---

## 📂 Dosya ve Dizin Yapısı
```text
Yeni klasör/
├── index.html                 # Ana Portal (Tüm bölümlerin manşet ve özetleri)
├── seyyahlar.html             # Seyyahlar ve Rotalar Kataloğu
├── podcast.html               # Rihle Podcast Yayınları ve Ses Oynatıcısı
├── kitap-onerileri.html       # Seyahat ve Tarih Kitaplığı & Öneriler
├── hakkimizda.html            # Hakkımızda, Misyon ve Arşiv Künyesi
├── iletisim.html              # İletişim, Arşive Katkı Formu & SSS
├── README.md                  # Proje Rehberi ve Dokümantasyon
└── assets/
    ├── css/
    │   └── style.css          # Özel renk paleti, tipografi, dark mode ve responsive kurallar
    ├── js/
    │   └── main.js            # Tema, arama, filtreler, podcast oynatıcı ve modal scriptleri
    └── images/
        └── rihle-logo.jpg     # Orijinal Rihle Archive Logosu
```

---

## 🧭 Navbar ve Sayfa Yapısı
Menüdeki her başlık kendi özel, bağımsız sayfasına yönlendirir:
1. **Ana Sayfa (`index.html`)**: Manşet dosya, günün seyyahı alıntısı, genel özet ve hızlı erişim.
2. **Seyyahlar (`seyyahlar.html`)**: İbn Battûta, Evliyâ Çelebi, Pîrî Reis, Kâtib Çelebi, İbn Fadlân, Marco Polo gibi seyyahların rotaları ve detayları.
3. **Podcast (`podcast.html`)**: Tarihçilerle söyleşiler ve özel ses oynatıcı widget'ı.
4. **Kitap Önerileri (`kitap-onerileri.html`)**: Seçkin seyahatnameler ve inceleme modalı.
5. **Hakkımızda (`hakkimizda.html`)**: Arşivin misyonu, felsefesi ve istatistikleri.
6. **İletişim (`iletisim.html`)**: İletişim formu (`iletisim.rihlearchive@gmail.com`), arşive katkı sağlama ve sıkça sorulan sorular.

---

## 💻 Nasıl Çalıştırılır?
Herhangi bir sunucu kurulumu gerektirmez:
1. Klasör içerisindeki `index.html` dosyasına çift tıklayarak doğrudan Chrome, Edge, Safari veya Firefox tarayıcınızda açabilirsiniz.
2. Dilerseniz VS Code Live Server eklentisiyle veya `npx serve` / Python `python -m http.server` ile de yerel sunucuda başlatabilirsiniz.

