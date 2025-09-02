import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  User,
  ChevronRight,
  Filter,
  Grid,
  List,
} from "lucide-react";
import articleImage from "../../assets/images/hero-bg.png"; // ganti sesuai aset kamu
import heroBackground from "../../assets/images/hero-bg.png"; // ganti sesuai aset hero

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data artikel
  const articles = [
    {
      id: 1,
      title: "Panduan Membaca Label Gizi pada Produk Makanan",
      description:
        "Banyak konsumen yang masih belum memahami informasi pada label gizi. Artikel ini membahas cara membaca label dengan benar untuk mengetahui kandungan gizi, kalori, dan bahan tambahan yang digunakan.",
      excerpt:
        "Pelajari cara membaca label gizi dengan benar untuk membuat pilihan makanan yang lebih sehat...",
      image: articleImage,
      category: "Edukasi",
      author: "Dr. Sari Nutritionist",
      date: "15 Agustus 2024",
      readTime: "5 menit",
      slug: "panduan-membaca-label-gizi",
    },
    {
      id: 2,
      title: "Cara Menyimpan Obat di Rumah dengan Aman",
      description:
        "Obat yang disimpan sembarangan dapat menurunkan khasiatnya atau bahkan menjadi berbahaya. Simpan obat di tempat yang kering, sejuk, dan jauh dari jangkauan anak-anak.",
      excerpt:
        "Tips praktis menyimpan obat-obatan di rumah untuk menjaga kualitas dan keamanannya...",
      image: articleImage,
      category: "Kesehatan",
      author: "Apt. Budi Farmasi",
      date: "12 Agustus 2024",
      readTime: "4 menit",
      slug: "cara-menyimpan-obat-aman",
    },
    {
      id: 3,
      title: "Mengenal Logo Halal dan Izin Edar pada Produk",
      description:
        "Logo halal dan izin edar dari BPOM memberikan jaminan keamanan bagi konsumen. Artikel ini mengulas perbedaan keduanya, serta tips memeriksa keaslian label tersebut.",
      excerpt:
        "Panduan lengkap mengenali logo halal dan izin edar untuk memastikan produk yang aman dikonsumsi...",
      image: articleImage,
      category: "Regulasi",
      author: "Tim BPOM Padang",
      date: "10 Agustus 2024",
      readTime: "6 menit",
      slug: "logo-halal-izin-edar",
    },
    {
      id: 4,
      title: "Bahaya Pewarna Tekstil dalam Makanan",
      description:
        "Penggunaan pewarna tekstil dalam makanan sangat berbahaya bagi kesehatan. Artikel ini membahas jenis-jenis pewarna yang dilarang dan dampaknya bagi tubuh.",
      excerpt:
        "Waspada pewarna tekstil yang sering disalahgunakan dalam makanan dan dampak kesehatannya...",
      image: articleImage,
      category: "Keamanan Pangan",
      author: "Dr. Lisa Toksiologi",
      date: "8 Agustus 2024",
      readTime: "7 menit",
      slug: "bahaya-pewarna-tekstil-makanan",
    },
    {
      id: 5,
      title: "Suplemen Herbal: Manfaat dan Risikonya",
      description:
        "Suplemen herbal semakin populer, namun tidak semua aman untuk dikonsumsi. Pelajari cara memilih suplemen herbal yang tepat dan terdaftar di BPOM.",
      excerpt:
        "Panduan memilih suplemen herbal yang aman dan terdaftar resmi di BPOM...",
      image: articleImage,
      category: "Obat Tradisional",
      author: "Prof. Dr. Herbal",
      date: "5 Agustus 2024",
      readTime: "8 menit",
      slug: "suplemen-herbal-manfaat-risiko",
    },
    {
      id: 6,
      title: "Deteksi Boraks dalam Makanan di Rumah",
      description:
        "Boraks masih sering ditemukan dalam makanan meski sudah dilarang. Artikel ini mengajarkan cara sederhana mendeteksi boraks dalam makanan menggunakan bahan-bahan rumah tangga.",
      excerpt:
        "Cara mudah mendeteksi kandungan boraks dalam makanan dengan tes sederhana di rumah...",
      image: articleImage,
      category: "Keamanan Pangan",
      author: "Tim Laboratorium BPOM",
      date: "3 Agustus 2024",
      readTime: "5 menit",
      slug: "deteksi-boraks-makanan",
    },
    {
      id: 7,
      title: "Kosmetik Ilegal: Ciri-ciri dan Bahayanya",
      description:
        "Kosmetik ilegal yang mengandung bahan berbahaya masih beredar. Kenali ciri-ciri kosmetik legal dan bahaya penggunaan kosmetik ilegal bagi kulit.",
      excerpt:
        "Tips mengenali kosmetik legal dan bahaya yang mengancam dari kosmetik ilegal...",
      image: articleImage,
      category: "Kosmetik",
      author: "dr. Maya Dermatologi",
      date: "1 Agustus 2024",
      readTime: "6 menit",
      slug: "kosmetik-ilegal-bahaya",
    },
    {
      id: 8,
      title: "Pengawasan Mutu Vaksin di Indonesia",
      description:
        "BPOM berperan penting dalam pengawasan mutu vaksin yang beredar di Indonesia. Pelajari proses pengawasan dan jaminan kualitas vaksin.",
      excerpt:
        "Mengenal proses pengawasan mutu vaksin untuk memastikan keamanan dan efektivitasnya...",
      image: articleImage,
      category: "Vaksin",
      author: "Tim Pengawasan BPOM",
      date: "28 Juli 2024",
      readTime: "9 menit",
      slug: "pengawasan-mutu-vaksin",
    },
  ];

  const categories = [
    "Semua",
    "Edukasi",
    "Kesehatan",
    "Regulasi",
    "Keamanan Pangan",
    "Obat Tradisional",
    "Kosmetik",
    "Vaksin",
  ];

  // Filter artikel berdasarkan pencarian dan kategori
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const CategoryBadge = ({ category }) => {
    const colors = {
      Edukasi: "bg-blue-100 text-blue-800",
      Kesehatan: "bg-green-100 text-green-800",
      Regulasi: "bg-purple-100 text-purple-800",
      "Keamanan Pangan": "bg-red-100 text-red-800",
      "Obat Tradisional": "bg-yellow-100 text-yellow-800",
      Kosmetik: "bg-pink-100 text-pink-800",
      Vaksin: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[category] || "bg-gray-100 text-gray-800"
        }`}
      >
        {category}
      </span>
    );
  };

  const ArticleCard = ({ article }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{article.author}</span>
          </div>
          <span>• {article.readTime}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-header transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <button className="flex items-center gap-2 text-header font-medium text-sm hover:gap-3 transition-all duration-200">
          Baca Selengkapnya
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const ArticleListItem = ({ article }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex">
        <div className="w-1/3 relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <CategoryBadge category={article.category} />
          </div>
        </div>
        <div className="w-2/3 p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <span>• {article.readTime}</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-header transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {article.description}
          </p>

          <button className="flex items-center gap-2 text-header font-medium hover:gap-3 transition-all duration-200">
            Baca Selengkapnya
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artikel BPOM</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Kumpulan artikel edukatif seputar keamanan obat, makanan, dan
            kosmetik untuk meningkatkan kesadaran masyarakat
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-header focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-header focus:border-transparent min-w-48"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${
                  viewMode === "grid"
                    ? "bg-header text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${
                  viewMode === "list"
                    ? "bg-header text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>
              Menampilkan {currentArticles.length} dari{" "}
              {filteredArticles.length} artikel
              {searchTerm && ` untuk "${searchTerm}"`}
              {selectedCategory !== "Semua" &&
                ` dalam kategori "${selectedCategory}"`}
            </p>
          </div>
        </div>

        {/* Articles Grid/List */}
        {currentArticles.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                  : "space-y-6 mb-12"
              }
            >
              {currentArticles.map((article) =>
                viewMode === "grid" ? (
                  <ArticleCard key={article.id} article={article} />
                ) : (
                  <ArticleListItem key={article.id} article={article} />
                )
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        currentPage === i + 1
                          ? "bg-header text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada artikel ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau pilih kategori yang berbeda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
