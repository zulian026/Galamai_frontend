import React, { useState, useEffect } from "react";
import galamai from "../../assets/images/galamai1.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-header w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 overflow-hidden pt-20 sm:pt-16 md:pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center max-w-7xl w-full relative z-10">
        {/* Left Content */}
        <div
          className={`
          space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1
          transform transition-all duration-700 ease-out
          ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }
        `}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight text-white">
            <span className="text-green-400">Galamai</span> – Galeri Layanan
            Masyarakat dan Informasi
          </h1>
          <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-xl mx-auto md:mx-0">
            Aplikasi terpadu berbasis Web dan SMS dari BBPOM Padang untuk
            memudahkan layanan dan memberikan informasi obat, makanan, serta
            layanan publik kapan saja dan di mana saja.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center md:justify-start">
            <button className="w-full sm:w-auto bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200">
              Lihat Layanan
            </button>
            <button className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold border border-green-400 text-green-400 hover:bg-green-400 hover:text-[#003366] transition-all duration-200">
              Pelajari lebih lanjut
            </button>
          </div>
        </div>

        {/* Right Content (Image + Cards) */}
        <div
          className={`
            relative flex justify-center order-1 md:order-2
            transform transition-all duration-700 ease-out delay-300
            ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}
        >
          <img
            src={galamai}
            alt="Layanan Publik"
            className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto rounded-4xl shadow-lg"
          />

          {/* Floating Cards */}
          <div
            className={`
              absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-l-2 sm:border-l-4 border-yellow-400
              transform transition-all duration-500 ease-out delay-500
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }
            `}
          >
            <p className="font-semibold text-[#003366]">📱 Antrian Online</p>
            <span className="text-gray-500 text-xs">Layanan cepat & mudah</span>
          </div>

          <div
            className={`
              absolute bottom-8 sm:bottom-10 left-0 sm:left-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-l-2 sm:border-l-4 border-blue-500
              transform transition-all duration-500 ease-out delay-700
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
            `}
          >
            <p className="font-semibold text-[#003366]">
              📊 Smart BBPOM Padang
            </p>
            <span className="text-gray-500 text-xs">Informasi real-time</span>
          </div>

          <div
            className={`
              absolute top-6 sm:top-8 right-2 sm:right-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-l-2 sm:border-l-4 border-green-500
              transform transition-all duration-500 ease-out delay-900
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }
            `}
          >
            <p className="font-semibold text-green-600">✅ Si Prima</p>
            <span className="text-gray-500 text-xs">Pengaduan & survei</span>
          </div>
        </div>
      </div>

      {/* Inverted Half Circle Bottom Divider - Center is highest point */}
      <div
        className={`
        absolute bottom-0 left-0 w-full overflow-hidden leading-[0]
        transform transition-all duration-1000 ease-out delay-1100
        ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }
      `}
      >
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[50px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C300,20 900,20 1200,120 L1200,120 L0,120 Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
