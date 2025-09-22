import React, { useState, useEffect } from "react";
import galamai from "../../assets/images/galamai1.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Data untuk bar chart dengan 9 layanan
  const chartData = [
    { label: "Layanan Online", value: 85, color: "bg-green-400" },
    { label: "Antrian Digital", value: 92, color: "bg-blue-400" },
    { label: "Info Real-time", value: 78, color: "bg-yellow-400" },
    { label: "Pengaduan", value: 88, color: "bg-purple-400" },
    { label: "Kepuasan User", value: 95, color: "bg-pink-400" },
    { label: "SMS Gateway", value: 82, color: "bg-indigo-400" },
    { label: "Registrasi", value: 90, color: "bg-red-400" },
    { label: "Konsultasi", value: 87, color: "bg-orange-400" },
    { label: "Monitoring", value: 93, color: "bg-teal-400" },
  ];

  // Data FAQ
  const faqData = [
    {
      question: "Apa itu GALAMAI?",
      answer:
        "GALAMAI adalah aplikasi terpadu BBPOM Padang untuk layanan publik berbasis web dan SMS yang memudahkan akses informasi obat dan makanan.",
    },
    {
      question: "Bagaimana cara menggunakan layanan?",
      answer:
        "Anda dapat mengakses layanan melalui website atau mengirim SMS dengan format tertentu. Semua layanan tersedia 24/7 untuk kemudahan Anda.",
    },
    {
      question: "Apakah layanan ini gratis?",
      answer:
        "Ya, semua layanan GALAMAI dapat diakses secara gratis. Kami berkomitmen memberikan pelayanan terbaik untuk masyarakat.",
    },
    {
      question: "Berapa lama response time?",
      answer:
        "Sistem kami memberikan respons dalam waktu kurang dari 2 detik untuk memastikan pengalaman pengguna yang optimal.",
    },
  ];

  // Auto-rotate FAQ
  useEffect(() => {
    const faqInterval = setInterval(() => {
      setCurrentFaq((prev) => (prev + 1) % faqData.length);
    }, 4000); // Ganti tiap 4 detik

    return () => clearInterval(faqInterval);
  }, [faqData.length]);

  // Add floating animation keyframes
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

  useEffect(() => {
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

      {/* Grid konten utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center max-w-7xl w-full relative z-10">
        {/* Left Content */}
        <div
          className={`space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1
            transform transition-all duration-700 ease-out
            ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }
          `}
        >
          {/* Logo Galamai */}
          {/* <div className="flex justify-center md:justify-start mb-4">
            <img
              src={galamai}
              alt="Logo Galamai"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl shadow-lg"
            />
          </div> */}

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

        {/* Right Content (Chart) */}
        <div
          className={`relative flex justify-center order-1 md:order-2
            transform transition-all duration-700 ease-out delay-300
            ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}
        >
          <div className="backdrop-blur-xl rounded-3xl p-6 w-full max-w-2xl relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl translate-y-8 -translate-x-8"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold">
                  Performa Layanan GALAMAI
                </h3>
              </div>

              <div className="flex items-end justify-center h-64 gap-1 mb-6">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center group flex-1 min-w-0 relative"
                  >
                    {/* Base shadow gradient - muncul dari bayangan */}
                    <div
                      className={`absolute bottom-0 w-full max-w-[32px] sm:max-w-[36px] md:max-w-[40px] lg:max-w-[44px] xl:max-w-[48px]
                        transform transition-all duration-1200 ease-out
                        ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                        }
                      `}
                      style={{
                        height: isVisible
                          ? `${(item.value / 100) * 220}px`
                          : "0px",
                        transitionDelay: `${600 + index * 150}ms`,
                        background: `linear-gradient(to top, ${
                          item.color === "bg-green-400"
                            ? "rgba(74, 222, 128, 0.4), rgba(74, 222, 128, 0.1), transparent"
                            : item.color === "bg-blue-400"
                            ? "rgba(96, 165, 250, 0.4), rgba(96, 165, 250, 0.1), transparent"
                            : item.color === "bg-yellow-400"
                            ? "rgba(250, 204, 21, 0.4), rgba(250, 204, 21, 0.1), transparent"
                            : item.color === "bg-purple-400"
                            ? "rgba(192, 132, 252, 0.4), rgba(192, 132, 252, 0.1), transparent"
                            : item.color === "bg-pink-400"
                            ? "rgba(244, 114, 182, 0.4), rgba(244, 114, 182, 0.1), transparent"
                            : item.color === "bg-indigo-400"
                            ? "rgba(129, 140, 248, 0.4), rgba(129, 140, 248, 0.1), transparent"
                            : item.color === "bg-red-400"
                            ? "rgba(248, 113, 113, 0.4), rgba(248, 113, 113, 0.1), transparent"
                            : item.color === "bg-orange-400"
                            ? "rgba(251, 146, 60, 0.4), rgba(251, 146, 60, 0.1), transparent"
                            : "rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.1), transparent"
                        })`,
                        filter: "blur(4px)",
                        borderRadius: "12px 12px 0 0",
                      }}
                    ></div>

                    {/* Reflection shadow at the bottom */}
                    <div
                      className={`absolute bottom-0 w-full max-w-[32px] sm:max-w-[36px] md:max-w-[40px] lg:max-w-[44px] xl:max-w-[48px]
                        h-8 transform transition-all duration-1200 ease-out
                        ${
                          isVisible
                            ? "translate-y-8 opacity-60"
                            : "translate-y-12 opacity-0"
                        }
                      `}
                      style={{
                        transitionDelay: `${700 + index * 150}ms`,
                        background: `radial-gradient(ellipse at center, ${
                          item.color === "bg-green-400"
                            ? "rgba(74, 222, 128, 0.3)"
                            : item.color === "bg-blue-400"
                            ? "rgba(96, 165, 250, 0.3)"
                            : item.color === "bg-yellow-400"
                            ? "rgba(250, 204, 21, 0.3)"
                            : item.color === "bg-purple-400"
                            ? "rgba(192, 132, 252, 0.3)"
                            : item.color === "bg-pink-400"
                            ? "rgba(244, 114, 182, 0.3)"
                            : item.color === "bg-indigo-400"
                            ? "rgba(129, 140, 248, 0.3)"
                            : item.color === "bg-red-400"
                            ? "rgba(248, 113, 113, 0.3)"
                            : item.color === "bg-orange-400"
                            ? "rgba(251, 146, 60, 0.3)"
                            : "rgba(45, 212, 191, 0.3)"
                        }, transparent)`,
                        filter: "blur(6px)",
                        borderRadius: "50%",
                      }}
                    ></div>

                    <div
                      className={`w-full max-w-[32px] sm:max-w-[36px] md:max-w-[40px] lg:max-w-[44px] xl:max-w-[48px] 
                        rounded-t-xl shadow-xl relative overflow-hidden z-10
                        transform transition-all duration-1200 ease-out cursor-pointer
                        hover:scale-110 hover:shadow-2xl group-hover:z-20
                        ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                        }
                      `}
                      style={{
                        height: isVisible
                          ? `${(item.value / 100) * 200}px`
                          : "0px",
                        transitionDelay: `${800 + index * 150}ms`,
                        background: `linear-gradient(135deg, ${
                          item.color === "bg-green-400"
                            ? "#4ade80, #22c55e"
                            : item.color === "bg-blue-400"
                            ? "#60a5fa, #3b82f6"
                            : item.color === "bg-yellow-400"
                            ? "#facc15, #eab308"
                            : item.color === "bg-purple-400"
                            ? "#c084fc, #a855f7"
                            : item.color === "bg-pink-400"
                            ? "#f472b6, #ec4899"
                            : item.color === "bg-indigo-400"
                            ? "#818cf8, #6366f1"
                            : item.color === "bg-red-400"
                            ? "#f87171, #ef4444"
                            : item.color === "bg-orange-400"
                            ? "#fb923c, #f97316"
                            : "#2dd4bf, #14b8a6"
                        })`,
                        boxShadow: `0 0 20px ${
                          item.color === "bg-green-400"
                            ? "rgba(74, 222, 128, 0.3)"
                            : item.color === "bg-blue-400"
                            ? "rgba(96, 165, 250, 0.3)"
                            : item.color === "bg-yellow-400"
                            ? "rgba(250, 204, 21, 0.3)"
                            : item.color === "bg-purple-400"
                            ? "rgba(192, 132, 252, 0.3)"
                            : item.color === "bg-pink-400"
                            ? "rgba(244, 114, 182, 0.3)"
                            : item.color === "bg-indigo-400"
                            ? "rgba(129, 140, 248, 0.3)"
                            : item.color === "bg-red-400"
                            ? "rgba(248, 113, 113, 0.3)"
                            : item.color === "bg-orange-400"
                            ? "rgba(251, 146, 60, 0.3)"
                            : "rgba(45, 212, 191, 0.3)"
                        }`,
                      }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      {/* Floating percentage */}
                      <div
                        className={`absolute -top-10 left-1/2 transform -translate-x-1/2
                          text-white text-xs font-bold bg-gradient-to-r from-gray-900/80 to-gray-800/80
                          backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-white/20
                          transition-all duration-700 ease-out
                          ${
                            isVisible
                              ? "translate-y-0 opacity-100 scale-100"
                              : "translate-y-4 opacity-0 scale-75"
                          }
                        `}
                        style={{ transitionDelay: `${1400 + index * 150}ms` }}
                      >
                        {item.value}%
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 rotate-45 -mt-1"></div>
                      </div>

                      {/* Pulsing glow effect */}
                      <div
                        className={`absolute inset-0 rounded-t-xl blur-lg opacity-60 animate-pulse`}
                        style={{
                          background: `linear-gradient(135deg, ${
                            item.color === "bg-green-400"
                              ? "#4ade80, #22c55e"
                              : item.color === "bg-blue-400"
                              ? "#60a5fa, #3b82f6"
                              : item.color === "bg-yellow-400"
                              ? "#facc15, #eab308"
                              : item.color === "bg-purple-400"
                              ? "#c084fc, #a855f7"
                              : item.color === "bg-pink-400"
                              ? "#f472b6, #ec4899"
                              : item.color === "bg-indigo-400"
                              ? "#818cf8, #6366f1"
                              : item.color === "bg-red-400"
                              ? "#f87171, #ef4444"
                              : item.color === "bg-orange-400"
                              ? "#fb923c, #f97316"
                              : "#2dd4bf, #14b8a6"
                          })`,
                        }}
                      ></div>
                    </div>

                    <div
                      className={`text-white text-[10px] sm:text-xs text-center mt-3 font-medium leading-tight
                        transform transition-all duration-600 ease-out px-1 break-words
                        ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }
                      `}
                      style={{
                        transitionDelay: `${1200 + index * 150}ms`,
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">24/7</div>
                  <div className="text-white/80 text-xs">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-lg">&lt;2s</div>
                  <div className="text-white/80 text-xs">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-lg">99%</div>
                  <div className="text-white/80 text-xs">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section di bawah grafik */}
      <div
        className={`w-full max-w-5xl mt-16 mb-20 px-4 transition-all duration-1000 ease-out delay-700
          ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }
        `}
      >
        <div className="relative perspective-1000">
          <div className="relative h-80 sm:h-64 md:h-60">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-out transform-gpu
                  ${
                    index === currentFaq
                      ? "translate-y-0 opacity-100 scale-100 rotate-0 z-20"
                      : index === (currentFaq + 1) % faqData.length
                      ? "translate-y-8 opacity-30 scale-95 rotate-1 z-10"
                      : index ===
                        (currentFaq - 1 + faqData.length) % faqData.length
                      ? "translate-y-4 opacity-20 scale-90 -rotate-1 z-0"
                      : "translate-y-12 opacity-0 scale-85 rotate-2 z-0"
                  }
                `}
                style={{
                  filter: index === currentFaq ? "blur(0px)" : "blur(2px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-lg translate-y-4 -translate-x-4"></div>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">Q</span>
                      </div>
                      <h4 className="text-white font-bold text-xl md:text-2xl leading-tight pt-2">
                        {faq.question}
                      </h4>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">A</span>
                      </div>
                      <p className="text-gray-200 text-base md:text-lg leading-relaxed pt-2 font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {faqData.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-500 rounded-full cursor-pointer
                  ${
                    index === currentFaq
                      ? "w-8 h-2 bg-green-400 shadow-lg shadow-green-400/50"
                      : "w-2 h-2 bg-white/30 hover:bg-white/50"
                  }
                `}
                onClick={() => setCurrentFaq(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider bawah */}
      <div
        className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0]
          transform transition-all duration-1000 ease-out delay-1100
          ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
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
