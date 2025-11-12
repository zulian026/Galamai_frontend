import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan tombol kalau sudah scroll 300px ke bawah
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    // Scroll ke atas dengan efek halus
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full p-3 shadow-lg transition-all duration-300 
        ${isVisible ? "opacity-100 scale-100 bg-blue-600 hover:bg-blue-700 text-white" : "opacity-0 scale-0 pointer-events-none"}`}
    >
      <ArrowUp className="w-8 h-8" />
    </button>
  );
}
