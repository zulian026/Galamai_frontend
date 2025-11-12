import React, { useState, useEffect } from "react";
import ChartPerforma from "../ChartPerforma";
import LogoGalamai from "../../assets/images/galamai1.png";

const HeroSection = () => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  // Text animation - independent, happens immediately
  useEffect(() => {
    const timerText = setTimeout(() => setIsTextVisible(true), 100);
    return () => clearTimeout(timerText);
  }, []);

  // Add floating animation keyframes
  useEffect(() => {
    const floatingStyle = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(5deg); }
        66% { transform: translateY(5px) rotate(-3deg); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `;
    const style = document.createElement("style");
    style.textContent = floatingStyle;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <section className="relative bg-header w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-24 xl:pt-28">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* Pills floating animation */}
        <div
          className="absolute top-10 left-10 w-8 h-8 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-32 right-20 w-6 h-6 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-64 left-32 w-4 h-8 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-40 right-16 w-10 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>
        <div
          className="absolute bottom-72 left-20 w-6 h-12 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3.8s" }}
        ></div>
        <div
          className="absolute top-20 right-32 w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "2.5s", animationDuration: "3.2s" }}
        ></div>

        {/* Medical cross symbols */}
        <div
          className="absolute top-16 left-1/4 text-white text-4xl animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "2s" }}
        >
          +
        </div>
        <div
          className="absolute bottom-20 right-1/4 text-white text-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "2.5s" }}
        >
          +
        </div>
        <div
          className="absolute top-1/3 right-10 text-white text-2xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        >
          +
        </div>
        <div
          className="absolute bottom-1/3 left-16 text-white text-5xl animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "2.8s" }}
        >
          +
        </div>

        {/* Food/health icons using CSS shapes */}
        <div className="absolute top-48 right-40">
          <div
            className="w-8 h-8 bg-white rounded-t-full animate-pulse"
            style={{ animationDelay: "1.2s", animationDuration: "3s" }}
          ></div>
          <div className="w-6 h-2 bg-white mx-auto"></div>
        </div>

        <div className="absolute bottom-48 left-40">
          <div
            className="w-10 h-6 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "2.3s", animationDuration: "2.7s" }}
          ></div>
          <div className="w-8 h-4 bg-white rounded-full mx-auto mt-1"></div>
        </div>

        {/* Molecular structure dots */}
        <div className="absolute top-1/4 left-1/3">
          <div className="relative">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-white rounded-full absolute top-4 left-6 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full absolute -top-2 left-8 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="w-1 h-8 bg-white absolute top-1 left-1.5 rotate-45"></div>
            <div className="w-1 h-6 bg-white absolute top-2 left-1.5 -rotate-12"></div>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-1/3">
          <div className="relative">
            <div
              className="w-4 h-4 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full absolute top-5 left-7 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-white rounded-full absolute -top-1 left-9 animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
            <div className="w-1 h-10 bg-white absolute top-2 left-2 rotate-60"></div>
            <div className="w-1 h-7 bg-white absolute top-2 left-2 -rotate-30"></div>
          </div>
        </div>
      </div>

      {/* Floating medical icons with more detail */}
      <div className="absolute inset-0 opacity-8">
        {/* Stethoscope shape */}
        <div
          className="absolute top-24 left-12 animate-float"
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        >
          <div className="w-1 h-16 bg-white/30 rounded-full transform rotate-12"></div>
          <div className="w-4 h-4 bg-white/30 rounded-full -mt-2"></div>
          <div className="w-6 h-6 bg-white/30 rounded-full -mt-4 ml-2"></div>
        </div>

        {/* Pill bottle */}
        <div
          className="absolute bottom-32 right-24 animate-float"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        >
          <div className="w-6 h-12 bg-white/20 rounded-lg"></div>
          <div className="w-8 h-3 bg-white/20 rounded-t-lg -mt-12 -ml-1"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full mx-auto mt-2"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full mx-auto mt-1"></div>
        </div>

        {/* Heart shape */}
        <div
          className="absolute top-1/2 left-8 animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "2s" }}
        >
          <div className="w-4 h-4 bg-white/25 rounded-full transform rotate-45 relative">
            <div className="w-4 h-4 bg-white/25 rounded-full absolute -left-2 top-0"></div>
            <div className="w-4 h-4 bg-white/25 rounded-full absolute left-0 -top-2"></div>
          </div>
        </div>

        {/* Syringe */}
        <div
          className="absolute top-40 right-12 animate-float"
          style={{ animationDelay: "3s", animationDuration: "7s" }}
        >
          <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          <div className="w-2 h-4 bg-white/25 rounded-sm ml-10 -mt-0.5"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full ml-12 -mt-2"></div>
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-header/50 to-header/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-header/60 via-transparent to-transparent"></div>

      {/* Mobile Layout: Flexbox Column */}
      <div className="flex flex-col items-center max-w-7xl w-full relative z-10 md:hidden">
        {/* Left Content - Di atas untuk mobile */}
        <div
          className={`space-y-4 sm:space-y-6 text-center mb-8 transform transition-all duration-700 ease-out ${
            isTextVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
            <span className="text-green-400">Galamai</span> – Galeri Layanan
            Masyarakat dan Informasi
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto">
            Aplikasi terpadu berbasis Web dan SMS dari BBPOM Padang untuk
            memudahkan layanan dan memberikan informasi obat, makanan, serta
            layanan publik kapan saja dan di mana saja.
          </p>
        </div>

        {/* Chart Content - Di bawah untuk mobile */}
        <ChartPerforma />
      </div>

      {/* Desktop Layout: Grid (md and above) */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center max-w-7xl w-full relative z-10">
        <div
          className={`space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1 transform transition-all duration-700 ease-out ${
            isTextVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <div className="flex justify-left mb-2">
            <img
              src={LogoGalamai}
              alt="Logo Galamai"
              className="w-16 sm:w-20 md:w-24 lg:w-28 drop-shadow-lg  rounded-2xl"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight text-white">
            <span className="text-green-400">Galamai</span> – Galeri Layanan
            Masyarakat dan Informasi
          </h1>
          <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-xl mx-auto md:mx-0">
            Aplikasi terpadu berbasis Web dan SMS dari BBPOM Padang untuk
            memudahkan layanan dan memberikan informasi obat, makanan, serta
            layanan publik kapan saja dan di mana saja.
          </p>
        </div>

        <div className="order-1 md:order-2">
          <ChartPerforma />
        </div>
      </div>

      {/* Divider bawah */}
      <div
        className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform transition-all duration-1000 ease-out delay-1100 ${
          isTextVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[0px]"
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
