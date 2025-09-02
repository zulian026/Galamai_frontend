import React, { useState, useEffect } from "react";
import heroBg from "../assets/images/hero-bg.png";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Pesan Anda telah dikirim!");
    setFormData({ name: "", email: "", message: "" });
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontak Kami</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Hubungi kami untuk pertanyaan, saran, atau informasi lebih lanjut
              mengenai layanan BPOM di Padang.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-14 px-6 md:px-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left - Contact Info + Map */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Informasi Kontak
              </h2>
              <ul className="space-y-5 text-gray-700">
                <li className="flex items-start">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <span className="ml-4">
                    Jl. Contoh Alamat No. 123, Padang, Sumatera Barat
                  </span>
                </li>
                <li className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <span className="ml-4">+62 812-3456-7890</span>
                </li>
                <li className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <span className="ml-4">info@bpom-padang.go.id</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-600 mt-1" />
                  <span className="ml-4">Senin - Jumat: 08.00 - 16.00 WIB</span>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="BPOM Padang Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1644.0323536214592!2d100.3646281972066!3d-0.9139454467029718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8c429a37afb%3A0x2b77e73c0745f075!2sBPOM%20Padang!5e1!3m2!1sid!2sid!4v1755567335276!5m2!1sid!2sid"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Kirim Pesan
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 space-y-5"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pesan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
