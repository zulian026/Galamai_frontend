// src/components/NewsSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { beritaEventService } from "../../services/beritaEventService";

export default function NewsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mainNews, setMainNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  const sectionRef = useRef(null);
  const swiperRef = useRef(null);
  const latestGridRef = useRef(null);

  // Function kategori -> warna
  const getCategoryColor = (category) => {
    const colors = {
      Tips: "bg-green-100 text-green-800",
      Berita: "bg-blue-100 text-blue-800",
      Edukasi: "bg-purple-100 text-purple-800",
      Event: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Fetch data dari API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await beritaEventService.getPaginated({
          page: 1,
          perPage: 7,
        });

        if (res?.data) {
          const allNews = res.data;

          // ambil 3 berita pertama jadi main news
          setMainNews(allNews.slice(0, 3));
          // sisanya untuk latest news
          setLatestNews(allNews.slice(3));
        }
      } catch (err) {
        console.error("Gagal ambil berita:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Intersection observer untuk animasi
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div
          className={`text-center mb-12 space-y-6 transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-16 opacity-0"
          }`}
          style={{
            transitionDelay: "0.2s",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <h2 className="text-3xl font-bold text-black">Berita & Event</h2>
          <div
            className={`w-16 h-1 bg-green-600 rounded-full mx-auto transition-all duration-1000 ${
              isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{
              transformOrigin: "center",
              transitionDelay: "0.4s",
            }}
          />
          <p
            className={`text-gray-600 font-normal text-base leading-relaxed max-w-2xl mx-auto transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
            style={{
              transitionDelay: "0.6s",
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            Informasi terkini seputar keamanan pangan, obat, dan kosmetik dari
            BPOM
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading berita...
          </div>
        ) : (
          <>
            {/* Main News Slider */}
            <div
              ref={swiperRef}
              className={`mb-16 transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
              style={{
                transitionDelay: "0.8s",
                transitionTimingFunction:
                  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet",
                  bulletActiveClass: "swiper-pagination-bullet-active",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                spaceBetween={20}
                slidesPerView={1}
                className="main-news-slider rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {mainNews.map((news) => (
                  <SwiperSlide key={news.id}>
                    <article className="bg-white overflow-hidden">
                      <div className="grid lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-3 relative group">
                          <img
                            src={news.image_url || news.image}
                            alt={`Gambar: ${news.title}`}
                            className="w-full h-80 md:h-[420px] lg:h-[480px] object-cover object-center transform group-hover:scale-105 transition-all duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                                news.type
                              )}`}
                            >
                              {news.type}
                            </span>
                          </div>
                          <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/10 to-green-600/10 rounded-xl -z-10 transform scale-95 group-hover:scale-100 transition-transform duration-500" />
                        </div>
                        <div className="lg:col-span-2 p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-6">
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            <span>{news.created_at}</span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {/* Bisa tambahkan waktu baca kalau ada */}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black leading-tight">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 font-normal text-base leading-relaxed line-clamp-3">
                            {news.description}
                          </p>
                          <div>
                            <a
                              href={`/news/${news.id}`}
                              className="group inline-block bg-header hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
                              aria-label={`Baca selengkapnya: ${news.title}`}
                            >
                              <span className="relative z-10 flex items-center">
                                Baca Selengkapnya
                                <svg
                                  className="ml-2 w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation */}
              <div className="flex justify-center mt-6 gap-4">
                <button className="swiper-button-prev-custom bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="swiper-button-next-custom bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Latest News */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-12 opacity-0"
              }`}
              style={{
                transitionDelay: "1s",
                transitionTimingFunction:
                  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-black">
                Berita Terbaru
              </h3>
              <a
                href="/berita/berita-event"
                className="group inline-flex items-center bg-header hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Lihat Semua Berita
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </a>
            </div>

            {/* Latest News Grid */}
            <div
              ref={latestGridRef}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {latestNews.map((news, index) => (
                <article
                  key={news.id}
                  className={`news-card group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-500 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${1.2 + index * 0.1}s`,
                    transitionTimingFunction:
                      "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={news.image_url || news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          news.type
                        )}`}
                      >
                        {news.type}
                      </span>
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/5 to-green-600/5 rounded-xl -z-10 transform scale-95 group-hover:scale-100 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span>{news.created_at}</span>
                    </div>
                    <h4 className="text-base font-bold text-black leading-tight group-hover:text-green-600 transition-colors duration-300">
                      <a
                        href={`/news/${news.id}`}
                        className="focus:outline-none"
                      >
                        <span className="absolute inset-0"></span>
                        {news.title}
                      </a>
                    </h4>
                    <p className="text-gray-600 font-normal text-sm line-clamp-3 leading-relaxed">
                      {news.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .main-news-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(59, 130, 246, 0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .main-news-slider .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
