import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import heroBg from "../../assets/images/hero-bg.png";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Eye,
  Clock,
  Tag,
  MapPin,
} from "lucide-react";

export default function NewsDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data dummy - dalam implementasi nyata, ini akan diambil dari API
  const newsData = {
    berita: {
      1: {
        id: 1,
        title: "Tips Memilih Makanan Kemasan yang Aman",
        date: "28 Agustus 2025",
        author: "Tim BPOM Padang",
        views: 1234,
        readTime: "5 menit",
        category: "Berita",
        location: "Padang, Sumatera Barat",
        image: heroBg,
        excerpt:
          "Kenali cara membaca label gizi, tanggal kedaluwarsa, dan kode produksi pada makanan kemasan.",
        content: `
          <p>Dalam era modern ini, makanan kemasan telah menjadi bagian tak terpisahkan dari kehidupan sehari-hari. Namun, tidak semua makanan kemasan aman untuk dikonsumsi. Oleh karena itu, penting bagi konsumen untuk mengetahui cara memilih makanan kemasan yang aman.</p>
          
          <h3>1. Periksa Label dan Kemasan</h3>
          <p>Langkah pertama yang harus dilakukan adalah memeriksa kondisi kemasan secara menyeluruh. Pastikan kemasan tidak rusak, penyok, atau bocor. Kemasan yang rusak dapat menjadi pintu masuk bagi bakteri dan kontaminan lainnya.</p>
          
          <h3>2. Baca Label Gizi dengan Teliti</h3>
          <p>Label gizi memberikan informasi penting tentang kandungan nutrisi dalam makanan. Perhatikan informasi berikut:</p>
          <ul>
            <li>Komposisi bahan (ditulis berdasarkan urutan jumlah terbanyak)</li>
            <li>Informasi nilai gizi per sajian</li>
            <li>Persentase Angka Kecukupan Gizi (%AKG)</li>
            <li>Kandungan gula, garam, dan lemak</li>
          </ul>
          
          <h3>3. Perhatikan Tanggal Kedaluwarsa</h3>
          <p>Tanggal kedaluwarsa adalah informasi krusial yang menunjukkan batas waktu aman untuk mengonsumsi produk. Ada beberapa istilah yang perlu dipahami:</p>
          <ul>
            <li><strong>Best Before:</strong> Produk masih aman dikonsumsi setelah tanggal tersebut, namun kualitas mungkin menurun</li>
            <li><strong>Use By:</strong> Produk tidak boleh dikonsumsi setelah tanggal tersebut</li>
            <li><strong>Exp Date:</strong> Tanggal kedaluwarsa mutlak</li>
          </ul>
          
          <h3>4. Cek Nomor Registrasi BPOM</h3>
          <p>Pastikan produk memiliki nomor registrasi BPOM yang valid. Nomor ini biasanya tercantum dengan format:</p>
          <ul>
            <li>MD untuk produk dalam negeri</li>
            <li>ML untuk produk luar negeri</li>
          </ul>
          
          <h3>5. Perhatikan Kondisi Penyimpanan</h3>
          <p>Beberapa produk memerlukan kondisi penyimpanan khusus seperti suhu dingin atau tempat kering. Pastikan produk disimpan sesuai dengan petunjuk di kemasan.</p>
          
          <h3>Kesimpulan</h3>
          <p>Memilih makanan kemasan yang aman memerlukan ketelitian dan pengetahuan yang cukup. Dengan mengikuti tips-tips di atas, konsumen dapat melindungi diri dan keluarga dari risiko keracunan makanan dan masalah kesehatan lainnya.</p>
          
          <p>BPOM Padang terus berkomitmen untuk melindungi masyarakat melalui pengawasan ketat terhadap produk makanan dan obat. Mari bersama-sama menjadi konsumen yang cerdas dan selektif.</p>
        `,
        tags: ["Keamanan Pangan", "Edukasi", "Label Gizi", "Konsumen Cerdas"],
      },
      2: {
        id: 2,
        title: "Penggerebekan Pabrik Obat Ilegal di Jakarta",
        date: "28 Agustus 2025",
        author: "Tim Investigasi BPOM",
        views: 2156,
        readTime: "8 menit",
        category: "Berita",
        location: "Jakarta",
        image: heroBg,
        excerpt:
          "BPOM menggerebek pabrik obat ilegal di Jakarta, menemukan ratusan obat tanpa izin edar.",
        content: `
          <p>Badan Pengawas Obat dan Makanan (BPOM) berhasil menggagalkan operasi pabrik obat ilegal di kawasan Jakarta Timur pada Selasa (28/8/2025). Operasi yang melibatkan tim gabungan dari BPOM pusat dan kepolisian ini merupakan bagian dari upaya pemberantasan obat ilegal di Indonesia.</p>
          
          <h3>Kronologi Penggerebekan</h3>
          <p>Penggerebekan dilakukan pada pukul 06.00 WIB berdasarkan laporan masyarakat dan hasil investigasi yang telah berlangsung selama tiga bulan. Tim gabungan menemukan aktivitas produksi obat tanpa izin di sebuah gudang yang menyamar sebagai distributor makanan.</p>
          
          <h3>Temuan di Lokasi</h3>
          <p>Dari hasil penggerebekan, petugas berhasil mengamankan:</p>
          <ul>
            <li>456 botol obat keras tanpa izin edar</li>
            <li>1.200 strip obat dengan kemasan menyerupai produk bermerek</li>
            <li>Mesin pencampur dan pengemas obat</li>
            <li>Bahan baku obat senilai Rp 2,5 miliar</li>
            <li>Dokumen palsu dan cap palsu</li>
          </ul>
          
          <h3>Modus Operandi</h3>
          <p>Menurut Kepala BPOM Jakarta, pelaku menggunakan modus operandi yang cukup rapi dengan menyamar sebagai distributor makanan. Mereka memproduksi obat keras seperti antibiotik dan obat jantung dengan kualitas yang tidak terjamin.</p>
          
          <p>"Obat-obat yang diproduksi tidak melalui uji kualitas yang proper, sehingga sangat berbahaya bagi konsumen," ungkap Kepala BPOM Jakarta dalam konferensi pers.</p>
          
          <h3>Penangkapan Tersangka</h3>
          <p>Polisi berhasil menangkap 4 orang tersangka yang terdiri dari pemilik pabrik, dua orang pekerja, dan satu orang distributor. Keempat tersangka kini ditahan di Polres Jakarta Timur untuk proses penyelidikan lebih lanjut.</p>
          
          <h3>Ancaman Hukuman</h3>
          <p>Tersangka dijerat dengan pasal berlapis, yaitu:</p>
          <ul>
            <li>UU No. 36 Tahun 2009 tentang Kesehatan</li>
            <li>UU No. 8 Tahun 1999 tentang Perlindungan Konsumen</li>
            <li>Pasal pemalsuan dokumen</li>
          </ul>
          <p>Ancaman hukuman maksimal adalah 15 tahun penjara dan denda Rp 1,5 miliar.</p>
          
          <h3>Imbauan kepada Masyarakat</h3>
          <p>BPOM mengingatkan masyarakat untuk selalu membeli obat di tempat yang terpercaya seperti apotek berizin. Hindari membeli obat dari sumber yang tidak jelas atau dengan harga yang terlalu murah dibandingkan harga normal.</p>
          
          <p>Masyarakat juga diminta untuk melaporkan apabila menemukan aktivitas mencurigakan terkait produksi atau penjualan obat ilegal melalui hotline BPOM di nomor 1500-533.</p>
        `,
        tags: ["Obat Ilegal", "Penggerebekan", "BPOM", "Keamanan", "Hukum"],
      },
    },
    event: {
      1: {
        id: 1,
        title: "Pameran Keamanan Pangan Nasional",
        date: "15 September 2025",
        author: "Panitia BPOM",
        views: 892,
        readTime: "3 menit",
        category: "Event",
        location: "Jakarta Convention Center",
        image: heroBg,
        excerpt:
          "Acara tahunan memamerkan inovasi keamanan pangan dari berbagai daerah.",
        content: `
          <p>Badan Pengawas Obat dan Makanan (BPOM) akan menggelar Pameran Keamanan Pangan Nasional 2025 pada 15-17 September 2025 di Jakarta Convention Center. Event tahunan ini merupakan wadah untuk memamerkan berbagai inovasi dan pencapaian dalam bidang keamanan pangan dari seluruh Indonesia.</p>
          
          <h3>Tema Pameran</h3>
          <p>Pameran tahun ini mengusung tema "Inovasi Digital untuk Keamanan Pangan Berkelanjutan". Tema ini dipilih untuk menekankan pentingnya pemanfaatan teknologi digital dalam meningkatkan sistem pengawasan keamanan pangan di Indonesia.</p>
          
          <h3>Agenda Kegiatan</h3>
          <p>Pameran akan berlangsung selama tiga hari dengan berbagai agenda menarik:</p>
          
          <h4>Hari Pertama (15 September 2025)</h4>
          <ul>
            <li>09.00 - Pembukaan oleh Menteri Kesehatan RI</li>
            <li>10.00 - Seminar Nasional "Digitalisasi Pengawasan Pangan"</li>
            <li>13.00 - Workshop "Implementasi Sistem Traceability"</li>
            <li>15.00 - Pameran Stand BPOM Daerah</li>
          </ul>
          
          <h4>Hari Kedua (16 September 2025)</h4>
          <ul>
            <li>09.00 - Kompetisi Inovasi Keamanan Pangan</li>
            <li>11.00 - Talkshow "Peran Industri dalam Keamanan Pangan"</li>
            <li>14.00 - Demonstrasi Teknologi Rapid Test</li>
            <li>16.00 - Networking Session</li>
          </ul>
          
          <h4>Hari Ketiga (17 September 2025)</h4>
          <ul>
            <li>09.00 - Seminar "Trend Global Keamanan Pangan"</li>
            <li>11.00 - Penghargaan Industri Pangan Terbaik</li>
            <li>13.00 - Penutupan dan Komitmen Bersama</li>
          </ul>
          
          <h3>Peserta dan Target</h3>
          <p>Event ini diikuti oleh:</p>
          <ul>
            <li>Seluruh BPOM di Indonesia (34 provinsi)</li>
            <li>Industri pangan nasional dan internasional</li>
            <li>Akademisi dan peneliti</li>
            <li>Organisasi konsumen</li>
            <li>Media massa</li>
            <li>Masyarakat umum</li>
          </ul>
          
          <p>Target peserta mencapai 10.000 orang selama tiga hari pameran.</p>
          
          <h3>Inovasi yang Dipamerkan</h3>
          <p>Beberapa inovasi unggulan yang akan dipamerkan antara lain:</p>
          <ul>
            <li>Sistem monitoring real-time untuk cold chain</li>
            <li>Aplikasi mobile untuk cek produk pangan</li>
            <li>Teknologi blockchain untuk traceability</li>
            <li>Rapid test kit untuk deteksi kontaminan</li>
            <li>AI untuk prediksi risiko keamanan pangan</li>
          </ul>
          
          <h3>Pendaftaran</h3>
          <p>Pendaftaran peserta dapat dilakukan secara online melalui website resmi BPOM atau datang langsung ke lokasi. Acara ini gratis untuk umum dengan registrasi terlebih dahulu.</p>
          
          <p>Untuk informasi lebih lanjut, hubungi:</p>
          <ul>
            <li>Website: www.pom.go.id</li>
            <li>Email: pameran2025@pom.go.id</li>
            <li>Telepon: (021) 4263333</li>
          </ul>
        `,
        tags: ["Pameran", "Keamanan Pangan", "Inovasi", "Digital", "Nasional"],
      },
    },
  };

  // Artikel terkait dummy
  const relatedNews = [
    {
      id: 3,
      title: "Edukasi Keamanan Pangan di Sekolah",
      date: "25 Agustus 2025",
      image: heroBg,
      category: "Berita",
    },
    {
      id: 4,
      title: "Kolaborasi Pengawasan Pangan Daerah",
      date: "22 Agustus 2025",
      image: heroBg,
      category: "Berita",
    },
    {
      id: 5,
      title: "Workshop Inspeksi Pangan",
      date: "20 Agustus 2025",
      image: heroBg,
      category: "Event",
    },
  ];

  useEffect(() => {
    // Simulasi loading data
    setIsLoading(true);

    setTimeout(() => {
      const data = newsData[type]?.[id];
      if (data) {
        setArticle(data);
        setRelatedArticles(relatedNews.filter((item) => item.id != id));
      }
      setIsLoading(false);
    }, 500);
  }, [id, type]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback untuk browser yang tidak support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Artikel tidak ditemukan
          </h2>
          <button
            onClick={() => navigate("/berita/berita-event")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO HEADER - Similar to NewsPage */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
            {/* Back Button */}
            {/* <button
              onClick={() => navigate("/berita/berita-event")}
              className="flex items-center text-white/80 hover:text-white mb-4 mx-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke {type === "berita" ? "Berita" : "Event"}
            </button> */}

            {/* Category Tag */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  type === "berita"
                    ? "bg-blue-600/20 text-blue-100 border border-blue-400/30"
                    : "bg-green-600/20 text-green-100 border border-green-400/30"
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {article.date}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {article.readTime}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {article.views.toLocaleString()} views
              </div>
              {article.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {article.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="text-sm text-gray-600">
            <span>Beranda</span> → <span>Berita & Event</span> →
            <span className="text-gray-800 font-medium"> {article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Share Button */}
        <div className="mb-8">
          <button
            onClick={handleShare}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Bagikan Artikel
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          {/* Excerpt */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-lg text-gray-700 font-medium italic">
              {article.excerpt}
            </p>
          </div>

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-6">Artikel Terkait</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <a
                key={related.id}
                href={`/berita/${related.category.toLowerCase()}/${related.id}`}
                className="group block"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {related.category}
                    </span>
                    <h4 className="font-semibold mt-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{related.date}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Custom Styles */}
      <style jsx>{`
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .prose h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
          color: #4b5563;
        }

        .prose ul {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
