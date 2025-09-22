import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  User,
  ChevronRight,
  Filter,
  Grid,
  List,
  Loader2,
  Eye,
} from "lucide-react";
import { artikelService } from "../../services/artikelService"; // sesuaikan path
import heroBackground from "../../assets/images/hero-bg.png";

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Fetch artikel dari backend
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await artikelService.getAll();
        if (response.success) {
          // Transform data sesuai dengan struktur model Artikel
          const transformedArticles = response.data.map((article) => ({
            ...article,
            category: "Artikel", // default category
            slug: `artikel-${article.id}`,
            // Buat excerpt dari description (hilangkan HTML tags)
            excerpt: article.description
              ? article.description.replace(/<[^>]*>/g, "").substring(0, 150) +
                "..."
              : "Baca artikel lengkap untuk informasi lebih detail...",
            // Format tanggal dari field tanggal atau created_at
            date: article.tanggal
              ? new Date(article.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : article.created_at
              ? new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
            // Gunakan image_url jika ada, fallback ke image atau default
            image: article.image_url || article.image || heroBackground,
          }));
          setArticles(transformedArticles);
        } else {
          setError("Gagal memuat artikel");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Terjadi kesalahan saat memuat artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = ["Semua", "Artikel"]; // Simplified categories karena backend tidak memiliki kategori

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
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
          onError={(e) => {
            e.target.src = heroBackground; // fallback jika gambar error
          }}
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
            <Eye size={14} />
            <span>{article.views || 0} views</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <Link
          to={`/artikel/${article.id}`}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:gap-3 transition-all duration-200"
        >
          Baca Selengkapnya
          <ChevronRight size={16} />
        </Link>
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 min-h-48"
            onError={(e) => {
              e.target.src = heroBackground; // fallback jika gambar error
            }}
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
              <Eye size={14} />
              <span>{article.views || 0} views</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>

          <button className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all duration-200">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
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
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2
                className="animate-spin text-blue-600 mx-auto mb-4"
                size={48}
              />
              <p className="text-gray-600">Memuat artikel...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {/* Articles Grid/List */}
        {!loading && !error && (
          <>
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
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
                  Coba ubah kata kunci pencarian atau pilih kategori yang
                  berbeda
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
