// src/pages/LayananSidebarPage.jsx
import React, { useEffect, useState, useRef } from "react";
import heroBg from "../assets/images/hero-bg.png";
import { Search, FileText, Clock, Calendar } from "lucide-react";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";

export default function LayananSidebarPage() {
  const [layananList, setLayananList] = useState([]);
  const [activeLayanan, setActiveLayanan] = useState(null);
  const [activeLayananData, setActiveLayananData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiBase = "http://localhost:8000/api/layanans";
  const contentRef = useRef(null);

  // ambil daftar layanan
  useEffect(() => {
    axios
      .get(apiBase)
      .then((res) => {
        setLayananList(res.data);
        if (res.data.length > 0) {
          setActiveLayanan(res.data[0].id); // default pilih pertama
        }
      })
      .catch((err) => console.error("Gagal fetch:", err));
  }, []);

  // ambil detail layanan
  useEffect(() => {
    if (activeLayanan) {
      axios
        .get(`${apiBase}/${activeLayanan}`)
        .then((res) => setActiveLayananData(res.data))
        .catch((err) => console.error("Gagal load:", err));
    }
  }, [activeLayanan]);

  // Scrollspy: update active layanan saat scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const layananId = entry.target.getAttribute("data-id");
            setActiveLayanan(Number(layananId));
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.2 }
    );

    const sections = contentRef.current?.querySelectorAll("[data-id]") || [];
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [activeLayananData]);

  const filteredLayanan = layananList.filter((layanan) =>
    layanan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 scroll-smooth">
      {/* Hero */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-header/95 "></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Layanan</h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-90">
              Jelajahi layanan kami dan pilih untuk melihat deskripsi lengkap.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 pt-[90px]">
        {/* Sidebar */}
        <aside
          className="md:w-1/3 bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-5 
          max-h-[calc(100vh-90px)] sticky top-[90px] self-start overflow-y-auto"
        >
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari layanan..."
              className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-header"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
            {filteredLayanan.length > 0 ? (
              filteredLayanan.map((layanan) => (
                <button
                  key={layanan.id}
                  onClick={() => {
                    setActiveLayanan(layanan.id);
                    const target = document.querySelector(
                      `[data-id="${layanan.id}"]`
                    );
                    if (target) {
                      target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className={`text-left px-4 py-3 rounded-xl transition-all ${
                    activeLayanan === layanan.id
                      ? "bg-header text-white font-semibold shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {layanan.title}
                </button>
              ))
            ) : (
              <p className="text-gray-500 p-2">
                Tidak ada layanan yang sesuai.
              </p>
            )}
          </div>
        </aside>

        {/* Konten */}
        <section
          ref={contentRef}
          className="md:w-2/3 bg-white shadow-lg rounded-2xl overflow-hidden"
        >
          {activeLayananData ? (
            <article
              data-id={activeLayananData.id}
              className="prose prose-lg max-w-none"
            >
              {/* Header Article */}
              <div className="bg-gradient-to-r from-header/5 to-blue-50 p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-header/10 rounded-lg">
                    <FileText className="w-6 h-6 text-header" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Layanan Publik</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {activeLayananData.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Estimasi baca 3-5 menit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Terakhir diperbarui</span>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              {activeLayananData.image && (
                <div className="relative px-8 py-6">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={activeLayananData.image}
                      alt={activeLayananData.title}
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="px-8 pb-8">
                {activeLayananData.details ? (
                  <div className="content-reading">
                    {/* Reading Guide */}
                    <div className="bg-blue-50 border-l-4 border-header p-6 rounded-r-lg mb-8">
                      <h3 className="text-lg font-semibold text-header mb-2">
                        📋 Panduan Membaca
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed">
                        Silakan baca informasi layanan berikut dengan seksama
                        untuk memahami prosedur, persyaratan, dan
                        langkah-langkah yang diperlukan.
                      </p>
                    </div>

                    {/* Main Content */}
                    <div
                      className="ql-editor reading-content"
                      dangerouslySetInnerHTML={{
                        __html: activeLayananData.details,
                      }}
                      style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.8",
                        color: "#374151",
                        padding: "0",
                      }}
                    />

                    {/* Call to Action */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-header/5 to-blue-50 rounded-2xl border border-header/10">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-header mb-3">
                          Butuh Bantuan Lebih Lanjut?
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tim kami siap membantu Anda dengan layanan ini.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button className="px-6 py-3 bg-header text-white rounded-xl hover:bg-header/90 transition-colors font-medium">
                            Hubungi Kami
                          </button>
                          <button className="px-6 py-3 border border-header text-header rounded-xl hover:bg-header/5 transition-colors font-medium">
                            FAQ Layanan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      Belum ada detail layanan tersedia.
                    </p>
                  </div>
                )}
              </div>
            </article>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Pilih Layanan
                </h3>
                <p className="text-gray-500">
                  Silakan pilih layanan dari sidebar untuk melihat deskripsi
                  lengkap.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Styling tambahan */}
      <style jsx>{`
        .reading-content h1,
        .reading-content h2,
        .reading-content h3,
        .reading-content h4 {
          color: #1f2937 !important;
          font-weight: 700 !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
        }
        .reading-content h1 {
          font-size: 2rem !important;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }
        .reading-content h2 {
          font-size: 1.5rem !important;
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
        }
        .reading-content p {
          margin-bottom: 1.5rem !important;
          text-align: justify !important;
        }
      `}</style>
    </div>
  );
}
