import React, { useState, useEffect, useRef } from "react";
import { BookOpen, HelpCircle, Shield, Users, ArrowRight } from "lucide-react";

export default function LayananKami() {
  const [tab, setTab] = useState("eksternal");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const layananData = {
    internal: [
      {
        img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=60",
        title: "SIIP",
        desc: "Sampaikan keluhan atau ajukan pertanyaan terkait produk obat dan makanan.",
        btn: "Selengkapnya",
      },
      {
        img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=60",
        title: "Kompetensi SDM",
        desc: "Informasi lengkap dan daftar untuk pengiriman sampel produk.",
        btn: "Selengkapnya",
      },
      {
        img: "https://plus.unsplash.com/premium_photo-1709560425798-d9bb56dff78b?w=500&auto=format&fit=crop&q=60",
        title: "Pengukuran Kinerja",
        desc: "Pantau hasil kinerja internal dengan lebih mudah.",
        btn: "Selengkapnya",
      },
    ],
    eksternal: [
      {
        img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=60",
        title: "Pengaduan Masyarakat",
        desc: "Laporkan masalah terkait obat dan makanan.",
        btn: "Selengkapnya",
      },
      {
        img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
        title: "Informasi Produk",
        desc: "Cari informasi resmi terkait obat dan makanan.",
        btn: "Selengkapnya",
      },
      {
        img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60",
        title: "Layanan Konsultasi",
        desc: "Konsultasi langsung dengan ahli kesehatan.",
        btn: "Selengkapnya",
      },
      {
        img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
        title: "Edukasi Kesehatan",
        desc: "Materi edukasi dan tips kesehatan terpercaya.",
        btn: "Selengkapnya",
      },
    ],
  };

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
          {layananData[tab].map((item, index) => (
            <div
              key={index}
              className={`relative w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="relative h-48 w-full overflow-hidden rounded-3xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-200 mb-3 line-clamp-2">
                    {item.desc}
                  </p>

                  {/* Action Button */}
                  <button className="inline-flex items-center gap-2 bg-header hover:bg-green-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200">
                    
                    {item.btn}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
