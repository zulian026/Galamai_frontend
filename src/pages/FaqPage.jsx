import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Search, AlertCircle } from "lucide-react";
import heroBg from "../assets/images/hero-bg.png";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/faq-topics`, {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setTopics(data.data);
        }
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedTopic) params.append("topik", selectedTopic);
        if (searchTerm) params.append("search", searchTerm);

        const response = await fetch(`${API_BASE_URL}/faq?${params}`, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        console.log("FAQ Response:", data);

        if (data.success) {
          setFaqs(data.data);
        } else {
          setError(data.message || "Gagal memuat data FAQ");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data FAQ: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchFaqs();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedTopic, searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main>
      {/* HERO */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0  bg-header/95  "></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Pertanyaan yang sering diajukan terkait layanan dan informasi BPOM
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-14 px-6 md:px-16 bg-gradient-to-b bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-blue-900 mb-8">
            Pertanyaan Umum
          </h2>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {/* Topic Filter */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedTopic("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTopic === ""
                      ? "bg-header text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                  }`}
                >
                  Semua Topik
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTopic === topic
                        ? "bg-header text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Memuat FAQ...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Terjadi Kesalahan</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* FAQ List */}
          {!loading && !error && (
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(i)}
                      className="w-full flex justify-between items-start gap-4 p-5 text-left"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 block">
                          {typeof item.pertanyaan === "string"
                            ? item.pertanyaan
                            : item.pertanyaan?.isi_pertanyaan ||
                              "Pertanyaan tidak tersedia"}
                        </span>
                        {item.topik && (
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {item.topik}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                          openIndex === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openIndex === i && (
                      <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                        <div className="whitespace-pre-wrap">
                          {item.jawaban || "Jawaban tidak tersedia"}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                          {item.view_count !== undefined && (
                            <div className="text-xs text-gray-400">
                              👁 Dilihat {item.view_count} kali
                            </div>
                          )}
                          {item.publisher && (
                            <div className="text-xs text-gray-400">
                              📝{" "}
                              {typeof item.publisher === "string"
                                ? item.publisher
                                : item.publisher.nama_lengkap || "Admin"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Tidak ada FAQ yang cocok dengan pencarian Anda
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Coba gunakan kata kunci yang berbeda atau ubah filter topik
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
