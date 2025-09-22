import React, { useState, useEffect } from "react";
import heroBg from "../assets/images/hero-bg.png";
import { Info, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";

export default function ProfilPage() {
  const [tabs, setTabs] = useState([]); // daftar menu profil
  const [activeTab, setActiveTab] = useState(null); // id profil aktif
  const [content, setContent] = useState(null); // data detail profil
  const [loading, setLoading] = useState(false);

  // Ambil daftar profil untuk sidebar
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profil") // ganti sesuai base API
      .then((res) => {
        setTabs(res.data);
        if (res.data.length > 0) {
          setActiveTab(res.data[0].id); // otomatis pilih tab pertama
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Ambil detail saat tab berubah
  useEffect(() => {
    if (!activeTab) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/profil/${activeTab}`)
      .then((res) => {
        setContent(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* HEADER ala HERO */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Profil Balai POM
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Balai Pengawas Obat dan Makanan di Padang
            </p>
          </div>
        </div>
      </section>

      {/* LAYOUT dengan SIDEBAR */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:sticky lg:top-24">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-header rounded-xl flex items-center justify-center mr-3">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Menu Profil</h3>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full group flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-header text-white shadow-lg shadow-header/25 transform scale-[1.02]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-header hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {tab.image ? (
                        <img
                          src={tab.image}
                          alt={tab.title}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        <Info className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium leading-tight">
                        {tab.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        activeTab === tab.id
                          ? "rotate-90"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* KONTEN Area */}
          <div className="lg:w-3/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-8 lg:p-12 transition-all duration-700">
                {loading ? (
                  <div className="flex justify-center items-center py-20 text-header">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : content ? (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-header">
                      {content.title}
                    </h2>
                    {content.image && (
                      <img
                        src={content.image}
                        alt={content.title}
                        className="rounded-xl w-full max-h-96 object-cover"
                      />
                    )}
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: content.details }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">Pilih menu profil.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
