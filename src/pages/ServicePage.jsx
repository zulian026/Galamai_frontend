// src/pages/LayananSidebarPage.jsx
import React, { useEffect, useState } from "react";
import heroBg from "../assets/images/hero-bg.png";
import { Search } from "lucide-react";
import axios from "axios";

export default function LayananSidebarPage() {
  const [layananList, setLayananList] = useState([]);
  const [activeLayanan, setActiveLayanan] = useState(null);
  const [activeLayananData, setActiveLayananData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiBase = "http://localhost:8000/api/layanans";

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

  const filteredLayanan = layananList.filter((layanan) =>
    layanan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero */}
      <section>
        <div
          className="relative h-64 md:h-80 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Layanan</h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-90">
              Jelajahi layanan kami dan pilih untuk melihat deskripsi lengkap.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/3 bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-5 max-h-[75vh]">
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
                  onClick={() => setActiveLayanan(layanan.id)}
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
        <section className="md:w-2/3 bg-white shadow-lg rounded-2xl p-8">
          {activeLayananData ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-header">
                {activeLayananData.title}
              </h2>

              {activeLayananData.image && (
                <div className="flex justify-center mb-6">
                  <img
                    src={activeLayananData.image}
                    alt={activeLayananData.title}
                    className="max-h-72 rounded-lg shadow-md"
                  />
                </div>
              )}

              {activeLayananData.details ? (
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: activeLayananData.details,
                  }}
                />
              ) : (
                <p className="text-gray-600">Belum ada detail.</p>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              Pilih layanan untuk melihat deskripsi lengkap.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
