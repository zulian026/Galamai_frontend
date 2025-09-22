// src/components/ArticleSection.jsx
import React, { useEffect, useState } from "react";
import { artikelService } from "../../services/artikelService"; // pastikan path sesuai project kamu
import articleImage from "../../assets/images/hero-bg.png"; // fallback image

export default function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await artikelService.getPaginated({
          page: 1,
          perPage: 6,
        });
        if (response?.data) {
          setArticles(response.data);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Gagal memuat artikel. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="py-12 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">Artikel</h2>
          <a
            href="/berita/artikel"
            className="group inline-flex items-center bg-header hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Lihat Semua Artikel
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Loading & Error State */}
        {loading && <p className="text-gray-500">Memuat artikel...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Grid Artikel */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <div key={a.id} className="flex flex-col">
                <img
                  src={a.image_url || a.image || articleImage}
                  alt={a.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {a.description}
                </p>
                <a
                  href={`/artikel/${a.id}`}
                  className="text-blue-600 font-medium hover:underline mt-auto"
                >
                  Lihat Selengkapnya
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Jika tidak ada artikel */}
        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-500">Belum ada artikel.</p>
        )}
      </div>
    </section>
  );
}
