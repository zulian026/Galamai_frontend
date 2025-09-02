// src/components/ArticleSection.jsx
import React from "react";
import articleImage from "../../assets/images/hero-bg.png"; // ganti sesuai aset kamu

export default function ArticleSection() {
  const articles = [
    {
      title: "Panduan Membaca Label Gizi pada Produk Makanan",
      desc: "Banyak konsumen yang masih belum memahami informasi pada label gizi. Artikel ini membahas cara membaca label dengan benar untuk mengetahui kandungan gizi, kalori, dan bahan tambahan yang digunakan.",
      image: articleImage,
    },
    {
      title: "Cara Menyimpan Obat di Rumah dengan Aman",
      desc: "Obat yang disimpan sembarangan dapat menurunkan khasiatnya atau bahkan menjadi berbahaya. Simpan obat di tempat yang kering, sejuk, dan jauh dari jangkauan anak-anak.",
      image: articleImage,
    },
    {
      title: "Mengenal Logo Halal dan Izin Edar pada Produk",
      desc: "Logo halal dan izin edar dari BPOM memberikan jaminan keamanan bagi konsumen. Artikel ini mengulas perbedaan keduanya, serta tips memeriksa keaslian label tersebut.",
      image: articleImage,
    },
  ];

  return (
    <section className="py-12 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Artikel</h2>
          <a
            href="#"
            className="flex items-center text-blue-600 hover:underline font-medium text-sm"
          >
            Lihat Semua →
          </a>
        </div>

        {/* Grid Artikel */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a, i) => (
            <div key={i} className="flex flex-col">
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{a.desc}</p>
              <a
                href="#"
                className="text-blue-600 font-medium hover:underline mt-auto"
              >
                Lihat Selengkapnya
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
