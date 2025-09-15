import React, { useState, useEffect, useRef } from "react";
import { Shield, Users, ArrowRight } from "lucide-react";
import { aplikasiService } from "../../services/aplikasiService";

export default function LayananKami() {
  const [tab, setTab] = useState("eksternal");
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await aplikasiService.getAll();
        setData(res);
      } catch (error) {
        console.error("Error fetch aplikasi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [tab]);

  const filteredData = data.filter((item) => item.kategori === tab);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-12 xl:px-20 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6 transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight text-header">
            Layanan <span className="text-green-400">Aplikasi</span> Kami
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Bisa digunakan kapan saja dan dimana saja untuk memudahkan layanan
            dan memberikan informasi terpercaya.
          </p>

          {/* Tabs */}
          <div
            className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center transform transition-all duration-700 ease-out delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <button
              onClick={() => setTab("eksternal")}
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200 ${
                tab === "eksternal"
                  ? "bg-header hover:bg-header text-white"
                  : "border border-header text-header hover:bg-header hover:text-white"
              }`}
            >
              <Users size={16} className="inline mr-2" />
              Layanan Eksternal
            </button>
            <button
              onClick={() => setTab("internal")}
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200 ${
                tab === "internal"
                  ? "bg-header hover:bg-header text-white"
                  : "border border-header text-header hover:bg-header hover:text-white"
              }`}
            >
              <Shield size={16} className="inline mr-2" />
              Layanan Internal
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {loading ? (
            // Skeleton loading (3 card)
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="relative w-full max-w-sm bg-gray-200 rounded-3xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 w-full bg-gray-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-400 rounded-full w-24"></div>
                </div>
              </div>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.id_aplikasi}
                className={`relative w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden rounded-3xl">
                  <img
                    src={
                      item.image_url
                        ? `${import.meta.env.VITE_API_URL}/storage/${
                            item.image
                          }`
                        : "https://via.placeholder.com/500x300?text=No+Image"
                    }
                    loading="lazy"
                    alt={item.nama_app}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{item.nama_app}</h3>
                    <p className="text-sm text-gray-200 mb-3 line-clamp-2">
                      {item.deskripsi || "Tidak ada deskripsi"}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-header hover:bg-green-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200"
                    >
                      Kunjungi
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              Tidak ada data untuk kategori {tab}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
