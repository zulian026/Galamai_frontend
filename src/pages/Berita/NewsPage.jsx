import React, { useState, useEffect, useRef } from "react";
import heroBg from "../../assets/images/hero-bg.png";
import { MapPin, Newspaper, Calendar, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { beritaEventService } from "../../services/beritaEventService";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NewsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");
  const [newsData, setNewsData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "berita", label: "Berita", icon: Newspaper },
    { id: "event", label: "Event", icon: Calendar },
  ];

  const titleRef = useRef(null);
  const swiperRef = useRef(null);
  const latestGridRef = useRef(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Sesuaikan dengan cara penyimpanan token Anda

        const response = await beritaEventService.getAll(token);

        if (response?.data) {
          // Pisahkan berita dan event berdasarkan type/category
          const beritaItems = response.data.filter(
            (item) => item.type === "berita" || item.category === "berita"
          );
          const eventItems = response.data.filter(
            (item) => item.type === "event" || item.category === "event"
          );

          setNewsData(beritaItems);
          setEventData(eventItems);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchData();
  }, []);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
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

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImageUrl = (item) => {
    // Prioritas: image_url dari backend (sudah full URL)
    if (item.image_url) return item.image_url;

    // Fallback ke image path manual
    if (item.image && item.image.startsWith("http")) return item.image;
    if (item.image)
      return `${import.meta.env.VITE_API_URL}/storage/${item.image}`;

    // Fallback ke gambar default
    return heroBg;
  };

  // Data sesuai tab aktif
  const currentData = activeTab === "berita" ? newsData : eventData;
  const mainItems = currentData.slice(0, 2); // 2 item untuk slider
  const latestItems = currentData.slice(2, 6); // 4 item untuk grid

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* HERO */}
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

      {/* TAB Navigasi */}
      <section className="bg-white/50 text-sm backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex overflow-x-auto gap-3 py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-header text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200/70"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="py-14 px-6 md:px-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Kondisi jika tidak ada data */}
          {currentData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                Tidak ada data tersedia
              </div>
              <p className="text-gray-400">
                {activeTab === "berita"
                  ? "Belum ada berita"
                  : "Belum ada event"}
              </p>
            </div>
          )}

          {/* Slider - tampilkan jika ada data */}
          {mainItems.length > 0 && (
            <div ref={swiperRef} className="mb-12">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500 }}
                spaceBetween={24}
                slidesPerView={1}
              >
                {mainItems.map((item) => (
                  <SwiperSlide key={item.id}>
                    <article className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                      <div className="grid md:grid-cols-2">
                        <div className="relative group">
                          <span
                            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${
                              activeTab === "berita"
                                ? "bg-blue-600"
                                : "bg-green-600"
                            }`}
                          >
                            {activeTab === "berita" ? "Berita" : "Event"}
                          </span>

                          <img
                            src={getImageUrl(item)}
                            alt={item.title}
                            className="w-full h-80 md:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = heroBg;
                            }}
                          />
                        </div>
                        <div className="p-6 md:p-10 flex flex-col justify-center">
                          <h3 className="text-xl md:text-3xl font-bold mb-3">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {formatDate(item.created_at || item.tanggal)}
                          </p>
                          <p className="text-gray-700 mb-6">
                            {item.description || item.isi}
                          </p>
                          <a
                            href={`/${activeTab}/${item.id}`}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Lihat Selengkapnya →
                          </a>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Section Terbaru - tampilkan jika ada data latest */}
          {latestItems.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-blue-900">Terbaru</h4>
                <a
                  href="#"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Lihat Semua →
                </a>
              </div>

              <div
                ref={latestGridRef}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {latestItems.map((item) => (
                  <a
                    key={item.id}
                    href={`/${activeTab}/${item.id}`}
                    className="rounded-xl overflow-hidden shadow bg-white hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-2"
                  >
                    <div className="relative">
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${
                          activeTab === "berita"
                            ? "bg-blue-600"
                            : "bg-green-600"
                        }`}
                      >
                        {activeTab === "berita" ? "Berita" : "Event"}
                      </span>
                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = heroBg;
                        }}
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs font-medium text-gray-500">
                        {formatDate(item.created_at)}
                      </p>
                      <h5 className="text-base font-semibold mt-2">
                        {item.title}
                      </h5>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                        {item.description || item.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .animate-fade-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
