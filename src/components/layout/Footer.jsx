// src/components/Footer.jsx
import React from "react";
import {
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  Users,
} from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 overflow-hidden mt-20">
      {/* Enhanced background with gradient and wave effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-header via-header to-blue-900">
        <svg
          className="absolute bottom-0 left-0 w-full h-32"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,80 600,40 900,60 C1050,70 1150,50 1200,40 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C300,100 600,0 900,80 C1050,120 1150,60 1200,80 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Logo and Organization Info */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
                <img
                  src={logo}
                  alt="BPOM Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  BADAN POM
                </h2>
                <p className="text-blue-200 font-semibold text-lg">
                  Balai Besar POM di Padang
                </p>
                <p className="text-blue-300 text-sm mt-2 max-w-xs">
                  Melindungi masyarakat melalui pengawasan Obat dan Makanan
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex justify-center lg:justify-start space-x-4">
              {[
                {
                  icon: Facebook,
                  color: "hover:bg-blue-600",
                  label: "Facebook",
                },
                { icon: Twitter, color: "hover:bg-blue-400", label: "Twitter" },
                {
                  icon: Instagram,
                  color: "hover:bg-pink-500",
                  label: "Instagram",
                },
                { icon: Youtube, color: "hover:bg-red-500", label: "YouTube" },
              ].map(({ icon: Icon, color, label }) => (
                <a
                  key={label}
                  href="#"
                  className={`p-3 bg-white/10 rounded-full text-white transition-all duration-300 ${color} hover:scale-110 hover:shadow-lg`}
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center lg:justify-start">
              <Globe className="mr-2" size={20} />
              Menu Navigasi
            </h3>
            <ul className="space-y-3">
              {["Beranda", "Profil", "Layanan", "Berita", "Faq", "Kontak"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center justify-center lg:justify-start group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-orange-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>

            {/* Visitor Stats */}
            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <h4 className="text-white font-semibold mb-3 flex items-center justify-center lg:justify-start">
                <Users className="mr-2" size={18} />
                Statistik Pengunjung
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Hari ini:</span>
                  <span className="text-white font-semibold">101</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Bulan ini:</span>
                  <span className="text-white font-semibold">3,151</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total:</span>
                  <span className="text-white font-semibold">28,457</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm text-center md:text-left">
              © 2024 Balai Besar POM di Padang. Semua hak dilindungi
              undang-undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
