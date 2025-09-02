// AboutSection.jsx
import React, { useState, useEffect, useRef } from "react";
import aboutImage from "../../assets/images/bg-hero-2.png";
import { BookOpen, HelpCircle, Shield, Users, ArrowRight } from "lucide-react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
    <section ref={sectionRef} className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Gambar - Simple & Clean */}
          <div
            className={`
              transform transition-all duration-700 ease-out
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >
            <img
              src={aboutImage}
              alt="Tentang BBPOM Padang"
              className="w-full rounded-lg shadow-sm"
            />
          </div>

          {/* Konten - Minimalist */}
          <div className="space-y-6">
            {/* Judul */}
            <h2
              className={`
                text-3xl lg:text-4xl font-semibold text-gray-900
                transform transition-all duration-700 ease-out delay-100
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
            >
              Tentang Kami
            </h2>

            {/* Garis Aksen */}
            <div
              className={`
                w-12 h-1 bg-green-500 rounded
                transform transition-all duration-700 ease-out delay-200
                ${
                  isVisible
                    ? "scale-x-100 opacity-100"
                    : "scale-x-0 opacity-0"
                }
              `}
            />

            {/* Deskripsi */}
            <p
              className={`
                text-gray-600 text-base lg:text-lg leading-relaxed
                transform transition-all duration-700 ease-out delay-300
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
            >
              Balai Besar POM di Padang merupakan Unit Pelaksana Teknis Badan POM,
              sesuai Keputusan Kepala BPOM No. 05018/SK/KBPOM tahun 2001 dengan
              perubahan terakhir Peraturan Kepala BPOM Nomor 12 Tahun 2018.
            </p>

            {/* Simple List */}
            <div
              className={`
                space-y-3
                transform transition-all duration-700 ease-out delay-400
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-600">
                  Melindungi masyarakat dari obat dan makanan yang berisiko
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-600">
                  Meningkatkan kesadaran masyarakat tentang keamanan produk
                </p>
              </div>
            </div>

            {/* Simple Button */}
            <div
              className={`
                transform transition-all duration-700 ease-out delay-500
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
            >
              <a
                href="/profil"
                className="inline-flex items-center gap-2 bg-header hover:bg-green-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200"
              >
                Selengkapnya
                  <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}