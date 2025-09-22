import React, { useState, useEffect, useRef } from "react";
import heroBg from "../../assets/images/hero-bg.png";
import {
  MapPin,
  Newspaper,
  Calendar,
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Clock,
  User,
  Eye,
  ChevronRight,
  Grid3X3,
  List,
  Bookmark,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { beritaEventService } from "../../services/beritaEventService";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function NewsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");
  const [currentData, setCurrentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(8);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // ✅ FIXED: Separate counters for each tab
  const [beritaCount, setBeritaCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const tabs = [
    {
      id: "berita",
      label: "Berita Terkini",
      icon: Newspaper,
      count: beritaCount, // ✅ Use specific counter
    },
    {
      id: "event",
      label: "Event & Kegiatan",
      icon: Calendar,
      count: eventCount, // ✅ Use specific counter
    },
  ];

  const sortOptions = [
    { id: "newest", label: "Terbaru" },
    { id: "oldest", label: "Terlama" },
    { id: "popular", label: "Terpopuler" },
  ];

  const titleRef = useRef(null);
  const swiperRef = useRef(null);
  const latestGridRef = useRef(null);

  // ✅ FIXED: Fetch counts for both tabs
  const fetchTabCounts = async () => {
    try {
      // Fetch berita count
      const beritaResponse = await beritaEventService.getPaginated({
        page: 1,
        perPage: 1,
        type: 'berita',
      });
      if (beritaResponse?.meta) {
        setBeritaCount(beritaResponse.meta.total || 0);
      }

      // Fetch event count
      const eventResponse = await beritaEventService.getPaginated({
        page: 1,
        perPage: 1,
        type: 'event',
      });
      if (eventResponse?.meta) {
        setEventCount(eventResponse.meta.total || 0);
      }
    } catch (err) {
      console.error("Error fetching tab counts:", err);
    }
  };

  // Fetch data untuk slider (3 item terbaru tanpa pagination)
  const fetchSliderData = async () => {
    try {
      const response = await beritaEventService.getAll();
      if (response?.data) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAllData(sortedData);
      }
    } catch (err) {
      console.error("Error fetching slider data:", err);
    }
  };

  // ✅ FIXED: Fetch paginated data untuk publik
  const fetchPaginatedData = async (
    page = 1,
    type = activeTab,
    reset = false
  ) => {
    setLoading(true);
    try {
      const response = await beritaEventService.getPaginated({
        page,
        perPage,
        type,
        search: searchTerm,
        sort: sortBy,
      });

      if (response.data) {
        const newData = response.data;
        setCurrentData(reset ? newData : newData);
      }

      if (response.meta) {
        setTotalPages(response.meta.last_page || 1);
        setTotalItems(response.meta.total || 0);
        setCurrentPage(page);
        
        // ✅ Update specific tab counter
        if (type === 'berita') {
          setBeritaCount(response.meta.total || 0);
        } else if (type === 'event') {
          setEventCount(response.meta.total || 0);
        }
      }
    } catch (err) {
      setError("Gagal memuat data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSliderData(),
        fetchTabCounts(), // ✅ Fetch counts for both tabs
        fetchPaginatedData(1, activeTab, true),
      ]);
    };

    fetchInitialData();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (isLoaded) {
      setCurrentPage(1);
      setSearchTerm("");
      fetchPaginatedData(1, activeTab, true);
    }
  }, [activeTab]);

  // Fetch data when page changes
  useEffect(() => {
    if (isLoaded && currentPage > 1) {
      fetchPaginatedData(currentPage, activeTab, false);
      if (latestGridRef.current) {
        latestGridRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [currentPage]);

  // Fetch data when search or sort changes
  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchPaginatedData(1, activeTab, true);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, sortBy]);

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

  const getImageUrl = (item) => {
    if (item.image_url) return item.image_url;
    if (item.image && item.image.startsWith("http")) return item.image;
    if (item.image)
      return `${import.meta.env.VITE_API_URL}/storage/${item.image}`;
    return heroBg;
  };

  // Get slider data (3 terbaru dari semua data)
  const getSliderData = () => {
    const currentSliderData = allData.filter((item) =>
      activeTab === "berita"
        ? item.type === "berita" || item.category === "berita"
        : item.type === "event" || item.category === "event"
    );

    return currentSliderData.slice(0, 3);
  };

  const sliderItems = getSliderData();

  // Pagination handlers - DIPERBAIKI
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchPaginatedData(page, activeTab, true);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      fetchPaginatedData(currentPage - 1, activeTab, true);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchPaginatedData(currentPage + 1, activeTab, true);
    }
  };

  // Generate page numbers for pagination
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

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <span className="ml-4 text-gray-700 font-medium">Memuat data...</span>
      </div>
    );
  }

  const renderSnippet = (text, max = 150) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]*>/g, "");
    return cleanText.length > max ? cleanText.slice(0, max) + "..." : cleanText;
  };

  return (
    <main className="bg-gray-50">
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Berita dan Event
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Informasi terkini seputar kegiatan, pengawasan, dan perkembangan
              terbaru dari Balai POM di Padang
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
                placeholder="Cari berita atau event..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={handleSortChange}
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

      {/* Enhanced Tab Navigation */}
      <section className="">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex flex-wrap gap-4 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all transform hover:-translate-y-1 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
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
                  : `Belum ada ${
                      activeTab === "berita" ? "berita" : "event"
                    } tersedia`}
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

          {/* Featured Slider - Enhanced */}
          {sliderItems.length > 0 && (
            <div ref={swiperRef} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeTab === "berita" ? "Berita Utama" : "Event Unggulan"}
                  </h2>
                  <p className="text-gray-600">
                    Informasi penting yang perlu Anda ketahui
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
                {sliderItems.map((item, index) => (
                  <SwiperSlide key={item.id}>
                    <article className="relative group">
                      <div className="relative h-[500px] md:h-[600px]">
                        <img
                          src={getImageUrl(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = heroBg;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                          <div className="max-w-4xl">
                            <div className="flex items-center space-x-4 mb-4">
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                  activeTab === "berita"
                                    ? "bg-blue-600/80 backdrop-blur-sm"
                                    : "bg-green-600/80 backdrop-blur-sm"
                                }`}
                              >
                                {activeTab === "berita"
                                  ? "Berita Utama"
                                  : "Event Unggulan"}
                              </span>
                              <span className="text-sm opacity-80">
                                {formatDate(item.created_at || item.tanggal)}
                              </span>
                            </div>

                            <h3 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                              {item.title}
                            </h3>

                            <p className="text-lg opacity-90 mb-6 line-clamp-3">
                              {renderSnippet(item.description || item.isi, 200)}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm opacity-80 mb-6">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Tim BPOM
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />5 min read
                              </div>
                              {item.views && (
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-2" />
                                  {item.views} views
                                </div>
                              )}
                            </div>

                            <a
                              href={`/${activeTab}/${item.id}`}
                              className="inline-flex items-center bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
                            >
                              Baca Selengkapnya
                              <ChevronRight className="w-5 h-5 ml-2" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Latest Content Grid/List - Enhanced */}
          {(currentData.length > 0 || paginationLoading) && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                    {activeTab === "berita"
                      ? "Berita Terbaru"
                      : "Event Mendatang"}
                  </h4>
                  <p className="text-gray-600">
                    {totalItems} {activeTab === "berita" ? "berita" : "event"}{" "}
                    ditemukan
                    {searchTerm && ` untuk "${searchTerm}"`}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages}
                </div>
              </div>

              {/* Loading State for Pagination */}
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
                {currentData.map((item, index) => (
                  <article
                    key={item.id}
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
                      <span
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${
                          activeTab === "berita"
                            ? "bg-blue-600/90 backdrop-blur-sm"
                            : "bg-green-600/90 backdrop-blur-sm"
                        }`}
                      >
                        {activeTab === "berita" ? "Berita" : "Event"}
                      </span>

                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === "grid" ? "h-56" : "h-full"
                        }`}
                        onError={(e) => {
                          e.target.src = heroBg;
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
                        {formatDate(item.created_at)}
                        {item.views && (
                          <>
                            <span className="mx-2">•</span>
                            <Eye className="w-4 h-4 mr-1" />
                            {item.views}
                          </>
                        )}
                      </div>

                      <h5
                        className={`font-bold group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 ${
                          viewMode === "grid" ? "text-lg" : "text-xl"
                        }`}
                      >
                        {item.title}
                      </h5>

                      <p
                        className={`text-gray-600 line-clamp-3 mb-4 ${
                          viewMode === "grid" ? "text-sm" : "text-base"
                        }`}
                      >
                        {renderSnippet(
                          item.description || item.desc,
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

                      <a
                        href={`/${activeTab}/${item.id}`}
                        className={`inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link mt-auto ${
                          viewMode === "grid" ? "text-sm" : "text-base"
                        }`}
                      >
                        Baca Selengkapnya
                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && !paginationLoading && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-12 bg-white rounded-2xl shadow-lg p-6">
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Menampilkan {(currentPage - 1) * perPage + 1} -{" "}
                    {Math.min(currentPage * perPage, totalItems)} dari{" "}
                    {totalItems} {activeTab === "berita" ? "berita" : "event"}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
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

                    {/* Page Numbers */}
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

                    {/* Next Button */}
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

        /* Animation delays */
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

        /* Pagination Styles */
        .pagination-enter {
          opacity: 0;
          transform: translateY(20px);
        }

        .pagination-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }

        /* Loading skeleton animation */
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