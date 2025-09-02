import React, { useState, useEffect } from "react";
import heroBg from "../assets/images/hero-bg.png";
import { MapPin, ChevronDown, Search } from "lucide-react";

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "Apa itu BPOM?",
      answer:
        "Badan Pengawas Obat dan Makanan (BPOM) adalah lembaga pemerintah yang bertugas mengawasi peredaran obat dan makanan di Indonesia.",
    },
    {
      question: "Bagaimana cara mengecek izin edar produk?",
      answer:
        "Anda dapat mengecek izin edar produk melalui situs resmi BPOM atau aplikasi BPOM Mobile dengan memasukkan nama produk atau nomor registrasi.",
    },
    {
      question: "Apa yang harus dilakukan jika menemukan produk ilegal?",
      answer:
        "Segera laporkan ke BPOM terdekat atau melalui kanal pengaduan resmi yang tersedia di website BPOM.",
    },
    {
      question: "Apakah semua suplemen aman dikonsumsi?",
      answer:
        "Tidak semua suplemen aman. Konsumsi suplemen sesuai kebutuhan dan pastikan memiliki izin edar dari BPOM.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Pertanyaan yang sering diajukan terkait layanan dan informasi BPOM
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-14 px-6 md:px-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-blue-900 mb-8">
            Pertanyaan Umum
          </h2>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex justify-between items-center p-5 text-left"
                  >
                    <span className="font-medium text-gray-800">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 text-gray-600 border-t border-gray-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Tidak ada pertanyaan yang cocok.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
