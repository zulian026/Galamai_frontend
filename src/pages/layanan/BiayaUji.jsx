// src/pages/BiayaUjiPage.jsx
import React, { useState } from "react";
import { FileDown, Search, MapPin } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png"; // ganti sesuai path gambarmu

export default function BiayaUjiPage() {
  const [activeTab, setActiveTab] = useState("pangan");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "pangan", label: "Pangan" },
    { id: "kosmetika", label: "Kosmetika" },
    { id: "obat", label: "Obat" },
    { id: "lainnya", label: "Lainnya" },
  ];

  const data = [
    {
      no: 1,
      nama: "Uji Cemaran Mikroba",
      biaya: "Rp 150.000",
      kategori: "pangan",
    },
    { no: 2, nama: "Uji Kadar Gula", biaya: "Rp 120.000", kategori: "pangan" },
    {
      no: 3,
      nama: "Uji Kadar Alkohol",
      biaya: "Rp 200.000",
      kategori: "pangan",
    },
    {
      no: 4,
      nama: "Uji Kadar Vitamin C",
      biaya: "Rp 250.000",
      kategori: "kosmetika",
    },
    {
      no: 5,
      nama: "Uji Stabilitas Obat",
      biaya: "Rp 500.000",
      kategori: "obat",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.kategori === activeTab &&
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col mb-65">
      {/* 🔹 Hero Header sama kayak News Page tapi teks kiri */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Biaya Uji</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Informasi lengkap mengenai biaya uji laboratorium sesuai kategori.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Tab Navigasi */}
      <section className="bg-white/50 text-sm backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex overflow-x-auto gap-3 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-header text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200/70"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* 🔹 Search & Download */}
      <div className="container mx-auto px-6 mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari jenis uji..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-header hover:bg-header text-white rounded-lg transition-all">
          <FileDown className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {/* 🔹 Tabel Biaya Uji */}
      <div className="container mx-auto px-6 mt-6 overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-header text-white">
            <tr>
              <th className="border p-3 text-left">No</th>
              <th className="border p-3 text-left">Jenis Pengujian</th>
              <th className="border p-3 text-left">Biaya</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.no} className="hover:bg-gray-50">
                <td className="border p-3">{item.no}</td>
                <td className="border p-3">{item.nama}</td>
                <td className="border p-3">{item.biaya}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
