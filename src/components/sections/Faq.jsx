// src/components/FaqCarousel.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FaqCarousel() {
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const faqs = [
    {
      id: 1,
      question: "Apa itu BPOM?",
      answer:
        "BPOM adalah Badan Pengawas Obat dan Makanan yang bertugas mengawasi peredaran obat, makanan, dan minuman agar aman dikonsumsi masyarakat.",
    },
    {
      id: 2,
      question: "Bagaimana cara mengecek izin edar produk?",
      answer:
        "Kamu dapat mengecek izin edar melalui website resmi BPOM atau aplikasi BPOM Mobile dengan memasukkan nomor registrasi pada produk.",
    },
    {
      id: 3,
      question: "Apakah semua produk harus punya label gizi?",
      answer:
        "Tidak semua produk wajib memiliki label gizi. Kewajiban ini tergantung pada jenis produk dan peraturan yang berlaku.",
    },
    {
      id: 4,
      question: "Bagaimana cara melaporkan produk berbahaya?",
      answer:
        "Kamu dapat melaporkannya melalui call center BPOM, aplikasi BPOM Mobile, atau datang langsung ke kantor BPOM terdekat.",
    },
    {
      id: 5,
      question: "Apa saja yang diawasi BPOM?",
      answer:
        "BPOM mengawasi obat, makanan, minuman, kosmetik, suplemen kesehatan, dan produk tembakau untuk memastikan keamanan konsumen.",
    },
    {
      id: 6,
      question: "Bagaimana cara mendaftar produk ke BPOM?",
      answer:
        "Pendaftaran produk dapat dilakukan melalui sistem online BPOM dengan melengkapi dokumen persyaratan yang telah ditentukan.",
    },
  ];

  useEffect(() => {
    // Deteksi preferensi reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      setIsAutoplayEnabled(false);
    }

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      setIsAutoplayEnabled(!e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseEnter = () => {
    setIsAutoplayEnabled(false);
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion) {
      setIsAutoplayEnabled(true);
    }
  };

  return (
    <section
      className="py-16 md:py-18 px-12 md:px-8 lg:px-16 "
      aria-labelledby="faq-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2
            id="faq-title"
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-900 mb-4"
          >
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan BPOM
          </p>
        </div>

        {/* Desktop & Tablet Carousel */}
        <div
          className="hidden md:block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            centeredSlides={true}
            loop={faqs.length > 3}
            autoplay={
              isAutoplayEnabled && !prefersReducedMotion
                ? {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            navigation={{
              prevEl: ".faq-prev",
              nextEl: ".faq-next",
            }}
            pagination={{
              el: ".faq-pagination",
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="faq-swiper pb-12"
          >
            {faqs.map((faq) => (
              <SwiperSlide key={faq.id}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 lg:p-8 transition-all duration-300 h-full border border-gray-100">
                  <div className="flex flex-col h-full">
                    <div className="flex-shrink-0 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="faq-prev w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Slide sebelumnya"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="faq-pagination flex gap-6"></div>

            <button
              className="faq-next w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Slide selanjutnya"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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

        {/* Mobile Grid Layout */}
        <div className="md:hidden">
          <div className="grid gap-4 sm:gap-6">
            {faqs.slice(0, 4).map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show more button untuk mobile */}
          {faqs.length > 4 && (
            <div className="text-center mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Lihat FAQ Lainnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .faq-swiper .swiper-slide {
          transform: scale(0.9);
          opacity: 0.7;
          transition: all 0.3s ease;
          height: auto;
        }

        .faq-swiper .swiper-slide-active {
          transform: scale(1);
          opacity: 1;
          z-index: 2;
        }

        .faq-swiper .swiper-slide-next,
        .faq-swiper .swiper-slide-prev {
          opacity: 0.8;
          transform: scale(0.95);
        }

        /* Custom pagination styles */
        :global(.faq-pagination .swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        :global(.faq-pagination .swiper-pagination-bullet-active) {
          background: #2563eb;
          opacity: 1;
          transform: scale(1.2);
        }

        /* Hover effects untuk desktop */
        @media (min-width: 768px) {
          .faq-swiper .swiper-slide:hover {
            transform: scale(0.95);
          }

          .faq-swiper .swiper-slide-active:hover {
            transform: scale(1.02);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .faq-swiper .swiper-slide {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }

        /* Focus styles untuk accessibility */
        .faq-swiper .swiper-slide:focus-within {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
          border-radius: 1rem;
        }
      `}</style>
    </section>
  );
}
