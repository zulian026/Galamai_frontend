import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Eye,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  Loader2,
  Newspaper,
  TrendingUp,
  Clock,
  User,
  Bookmark,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { artikelService } from "../../services/artikelService";
import heroBackground from "../../assets/images/hero-bg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoaded, setIsLoaded] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const titleRef = useRef(null);
  const swiperRef = useRef(null);
  const latestGridRef = useRef(null);

  const sortOptions = [
    { id: "newest", label: "Terbaru" },
    { id: "oldest", label: "Terlama" },
    { id: "popular", label: "Terpopuler" },
  ];

  // Filter hanya artikel published
  const filterPublishedOnly = (data) => {
    return data.filter((item) => item.status === "publish");
  };

  // Transform artikel ke format yang sesuai
  const transformArticle = (article) => ({
    ...article,
    category: "Artikel",
    slug: `artikel-${article.id}`,
    excerpt: article.description
      ? article.description.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
      : "Baca artikel lengkap untuk informasi lebih detail...",
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
    image: article.image_url || article.image || heroBackground,
  });

  // Fetch slider data
  const fetchSliderData = async () => {
    try {
      const response = await artikelService.getByStatus("publish");
      if (response?.data) {
        const publishedData = filterPublishedOnly(response.data);
        const transformed = publishedData
          .map(transformArticle)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAllArticles(transformed);
      }
    } catch (err) {
      console.error("Error fetching slider data:", err);
    }
  };

  // Fetch paginated data
  const fetchPaginatedData = async (page = 1, reset = false) => {
    setPaginationLoading(true);
    try {
      const response = await artikelService.getByStatus("publish");
      if (response?.data) {
        const publishedData = filterPublishedOnly(response.data);
        let transformedData = publishedData.map(transformArticle);

        // Apply search filter
        if (searchTerm) {
          transformedData = transformedData.filter(
            (article) =>
              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }

        // Apply sorting
        if (sortBy === "newest") {
          transformedData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        } else if (sortBy === "oldest") {
          transformedData.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        } else if (sortBy === "popular") {
          transformedData.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        setTotalItems(transformedData.length);
        setTotalPages(Math.ceil(transformedData.length / itemsPerPage));

        const startIndex = (page - 1) * itemsPerPage;
        const paginatedData = transformedData.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        setCurrentData(paginatedData);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Terjadi kesalahan saat memuat artikel");
    } finally {
      setPaginationLoading(false);
      setLoading(false);
      setIsLoaded(true);
    }
  };

  // Initial fetch
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      await Promise.all([fetchSliderData(), fetchPaginatedData(1, true)]);
    };
    fetchInitial();
  }, []);

  // Fetch when search or sort changes
  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchPaginatedData(1, true);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, sortBy]);

  // Fetch when page changes
  useEffect(() => {
    if (isLoaded && currentPage > 1) {
      fetchPaginatedData(currentPage, false);
      if (latestGridRef.current) {
        latestGridRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [currentPage]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    [titleRef.current, swiperRef.current, latestGridRef.current].forEach(
      (el) => {
        if (el) observer.observe(el);
      }
    );

    return () => observer.disconnect();
  }, [isLoaded]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImageUrl = (article) => {
    if (article.image_url) return article.image_url;
    if (article.image && article.image.startsWith("http")) return article.image;
    if (article.image)
      return `${import.meta.env.VITE_API_URL}/storage/${article.image}`;
    return heroBackground;
  };

  const getSliderData = () => {
    return filterPublishedOnly(allArticles).slice(0, 3);
  };

  const sliderItems = getSliderData();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const renderSnippet = (text, max = 150) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]*>/g, "");
    return cleanText.length > max ? cleanText.slice(0, max) + "..." : cleanText;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <span className="ml-4 text-gray-700 font-medium">Memuat data...</span>
      </div>
    );
  }

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-header/95"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Artikel BPOM
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Kumpulan artikel edukatif seputar keamanan obat, makanan, dan
              kosmetik untuk meningkatkan kesadaran masyarakat
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Search & Filter Bar */}
      <section className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {currentData.length === 0 && !paginationLoading && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Tidak Ada Data
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `Tidak ditemukan hasil untuk "${searchTerm}"`
                  : "Belum ada artikel yang dipublikasikan"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          )}

          {/* Featured Slider */}
          {sliderItems.length > 0 && (
            <div ref={swiperRef} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Artikel Unggulan
                  </h2>
                  <p className="text-gray-600">
                    Artikel penting yang perlu Anda ketahui
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>

              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                navigation={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={0}
                slidesPerView={1}
                className="rounded-3xl shadow-2xl overflow-hidden"
              >
                {sliderItems.map((article) => (
                  <SwiperSlide key={article.id}>
                    <article className="relative group">
                      <div className="relative h-[500px] md:h-[600px]">
                        <img
                          src={getImageUrl(article)}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = heroBackground;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                          <div className="max-w-4xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-600/80 backdrop-blur-sm">
                                Artikel Unggulan
                              </span>
                              <span className="text-sm opacity-80">
                                {formatDate(
                                  article.created_at || article.tanggal
                                )}
                              </span>
                            </div>

                            <h3 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                              {article.title}
                            </h3>

                            <p className="text-lg opacity-90 mb-6 line-clamp-3">
                              {renderSnippet(
                                article.description || article.isi,
                                200
                              )}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm opacity-80 mb-6">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Tim BPOM
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />5 min read
                              </div>
                              {article.views && (
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-2" />
                                  {article.views} views
                                </div>
                              )}
                            </div>

                            <Link
                              to={`/artikel/${article.id}`}
                              className="inline-flex items-center bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
                            >
                              Baca Selengkapnya
                              <ChevronRight className="w-5 h-5 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Latest Articles Grid/List */}
          {(currentData.length > 0 || paginationLoading) && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                    Artikel Terbaru
                  </h4>
                  <p className="text-gray-600">
                    {totalItems} artikel ditemukan
                    {searchTerm && ` untuk "${searchTerm}"`}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages}
                </div>
              </div>

              {paginationLoading && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <span className="block mt-2 text-gray-600">
                    Memuat data...
                  </span>
                </div>
              )}

              <div
                ref={latestGridRef}
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "space-y-6"
                }
              >
                {currentData.map((article, index) => (
                  <article
                    key={article.id}
                    className={`group ${
                      viewMode === "grid"
                        ? "bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-2"
                        : "bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`relative ${
                        viewMode === "grid" ? "" : "w-80 flex-shrink-0"
                      }`}
                    >
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 bg-blue-600/90 backdrop-blur-sm">
                        Artikel
                      </span>

                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === "grid" ? "h-56" : "h-full"
                        }`}
                        onError={(e) => {
                          e.target.src = heroBackground;
                        }}
                      />

                      {/* Quick Actions Overlay */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={`p-6 flex-1 flex flex-col ${
                        viewMode === "list" ? "justify-center" : ""
                      }`}
                    >
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.created_at)}
                        {article.views && (
                          <>
                            <span className="mx-2">•</span>
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </>
                        )}
                      </div>

                      <h5
                        className={`font-bold group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 ${
                          viewMode === "grid" ? "text-lg" : "text-xl"
                        }`}
                      >
                        {article.title}
                      </h5>

                      <p
                        className={`text-gray-600 line-clamp-3 mb-4 ${
                          viewMode === "grid" ? "text-sm" : "text-base"
                        }`}
                      >
                        {renderSnippet(
                          article.description,
                          viewMode === "grid" ? 100 : 150
                        )}
                      </p>

                      {viewMode === "list" && (
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <User className="w-4 h-4 mr-2" />
                          Tim BPOM
                          <span className="mx-3">•</span>
                          <Clock className="w-4 h-4 mr-2" />5 min read
                        </div>
                      )}

                      <Link
                        to={`/artikel/${article.id}`}
                        className={`inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link mt-auto ${
                          viewMode === "grid" ? "text-sm" : "text-base"
                        }`}
                      >
                        Baca Selengkapnya
                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && !paginationLoading && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-12 bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} dari{" "}
                    {totalItems} artikel
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed bg-gray-100"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Sebelumnya
                    </button>

                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === "..." ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-xl font-medium transition-all ${
                                currentPage === page
                                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed bg-gray-100"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom Swiper Styles */
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }

        .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
          width: 12px;
          height: 12px;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #3b82f6;
        }

        [style*="animation-delay"] {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}
