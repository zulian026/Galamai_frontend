import React, { useState, useEffect, useRef } from "react";
import heroBg from "../../assets/images/hero-bg.png";
import { MapPin, Newspaper, Calendar } from "lucide-react"; // 🔹 Icon tab
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NewsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");

  const tabs = [
    { id: "berita", label: "Berita", icon: Newspaper },
    { id: "event", label: "Event", icon: Calendar },
  ];

  const mainNews = [
    {
      title: "Tips Memilih Makanan Kemasan yang Aman",
      date: "28 Agustus 2025",
      desc: "Kenali cara membaca label gizi, tanggal kedaluwarsa, dan kode produksi pada makanan kemasan.",
      image: heroBg,
    },
    {
      title: "Penggerebekan Pabrik Obat Ilegal di Jakarta",
      date: "28 Agustus 2025",
      desc: "BPOM menggerebek pabrik obat ilegal di Jakarta, menemukan ratusan obat tanpa izin edar.",
      image: heroBg,
    },
  ];

  const mainEvents = [
    {
      title: "Pameran Keamanan Pangan Nasional",
      date: "15 September 2025",
      desc: "Acara tahunan memamerkan inovasi keamanan pangan dari berbagai daerah.",
      image: heroBg,
    },
    {
      title: "Workshop Inspeksi Pangan",
      date: "20 September 2025",
      desc: "Pelatihan untuk petugas daerah dalam melakukan inspeksi keamanan pangan.",
      image: heroBg,
    },
  ];

  const latestNews = [
    {
      title: "Edukasi Keamanan Pangan di Sekolah",
      date: "28 Agustus 2025",
      desc: "Sosialisasi membaca label gizi dan masa kedaluwarsa bagi siswa sekolah.",
      image: heroBg,
    },
    {
      title: "Kolaborasi Pengawasan Pangan Daerah",
      date: "28 Agustus 2025",
      desc: "Sinergi BPOM dengan pemerintah daerah memperkuat pengawasan pangan.",
      image: heroBg,
    },
  ];

  const latestEvents = [
    {
      title: "Pelatihan Inspeksi Pangan",
      date: "28 Agustus 2025",
      desc: "Pelatihan bagi petugas pengawas untuk meningkatkan keamanan pangan di masyarakat.",
      image: heroBg,
    },
    {
      title: "Kampanye Makanan Aman",
      date: "28 Agustus 2025",
      desc: "Kampanye nasional untuk mengedukasi masyarakat tentang makanan aman.",
      image: heroBg,
    },
  ];

  const titleRef = useRef(null);
  const swiperRef = useRef(null);
  const latestGridRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

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
  }, []);

  // Data sesuai tab aktif
  const displayedMain = activeTab === "berita" ? mainNews : mainEvents;
  const displayedLatest = activeTab === "berita" ? latestNews : latestEvents;

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
          {/* Slider */}
          <div ref={swiperRef} className="mb-12">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500 }}
              spaceBetween={24}
              slidesPerView={1}
            >
              {/* SLIDER */}
              {displayedMain.map((news, i) => (
                <SwiperSlide key={i}>
                  <article className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                    <div className="grid md:grid-cols-2">
                      <div className="relative group">
                        {/* 🔹 Tag Kategori */}
                        <span
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            activeTab === "berita"
                              ? "bg-blue-600"
                              : "bg-green-600"
                          }`}
                        >
                          {activeTab === "berita" ? "Berita" : "Event"}
                        </span>

                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-80 md:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 md:p-10 flex flex-col justify-center">
                        <h3 className="text-xl md:text-3xl font-bold mb-3">
                          {news.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {news.date}
                        </p>
                        <p className="text-gray-700 mb-6">{news.desc}</p>
                        <a
                          href="#"
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

          {/* Terbaru */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-blue-900">Terbaru</h4>
            <a
              href="#"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Lihat Semua →
            </a>
          </div>

          {/* Grid */}
          <div
            ref={latestGridRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* GRID */}
            {displayedLatest.map((n, i) => (
              <a
                key={i}
                href="#"
                className="rounded-xl overflow-hidden shadow bg-white hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-2"
              >
                <div className="relative">
                  {/* 🔹 Tag Kategori */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      activeTab === "berita" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {activeTab === "berita" ? "Berita" : "Event"}
                  </span>
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-gray-500">{n.date}</p>
                  <h5 className="text-base font-semibold mt-2">{n.title}</h5>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                    {n.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-fade-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  );
}
