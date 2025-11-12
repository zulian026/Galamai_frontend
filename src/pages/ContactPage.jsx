import React, { useState, useEffect } from "react";
import heroBg from "../assets/images/hero-bg.png";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";
import { getContactInfo } from "../services/contactService";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    fetchContactData();
    return () => clearTimeout(t);
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await getContactInfo();
      setContactData(response.data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* HERO */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-header/95"></div>
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
      <section className="py-14 px-6 md:px-16 bg-gradient-to-b bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Title */}
          <h2 className="text-3xl font-bold text-blue-900 mb-10">
            Informasi Kontak
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div
              className={`w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-10 transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Left - Info */}
              <div className="space-y-8 text-gray-700 w-full md:w-1/2">
                {/* Alamat & Kontak */}
                <ul className="space-y-5">
                  {contactData?.address && (
                    <li className="flex items-start justify-center md:justify-start">
                      <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="ml-4 text-left">{contactData.address}</span>
                    </li>
                  )}

                  {/* Call Center 1 */}
                  {contactData?.call_center_1 && (
                    <li className="flex items-start justify-center md:justify-start">
                      <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="ml-4 text-left">
                        Call Center 1: <strong>{contactData.call_center_1}</strong>
                      </span>
                    </li>
                  )}

                  {/* Call Center 2 */}
                  {contactData?.call_center_2 && (
                    <li className="flex items-start justify-center md:justify-start">
                      <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="ml-4 text-left">
                        Call Center 2: <strong>{contactData.call_center_2}</strong>
                      </span>
                    </li>
                  )}

                  {/* Email */}
                  {contactData?.email && (
                    <li className="flex items-start justify-center md:justify-start">
                      <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="ml-4 text-left">{contactData.email}</span>
                    </li>
                  )}

                  {/* Jam Operasional */}
                  {contactData?.working_hours && (
                    <li className="flex items-start justify-center md:justify-start">
                      <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="ml-4 text-left">{contactData.working_hours}</span>
                    </li>
                  )}
                </ul>

                {/* Sosial Media */}
                {(contactData?.twitter || contactData?.youtube || contactData?.instagram || contactData?.facebook) && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Ikuti Kami di Media Sosial
                    </h3>
                    <div className="flex justify-center md:justify-start gap-5">
                      {/* Twitter */}
                      {contactData?.twitter && (
                        <a
                          href={contactData.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <Twitter className="w-6 h-6" />
                        </a>
                      )}

                      {/* YouTube */}
                      {contactData?.youtube && (
                        <a
                          href={contactData.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Youtube className="w-6 h-6" />
                        </a>
                      )}

                      {/* Instagram */}
                      {contactData?.instagram && (
                        <a
                          href={contactData.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-700 transition"
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                      )}

                      {/* Facebook */}
                      {contactData?.facebook && (
                        <a
                          href={contactData.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 transition"
                        >
                          <Facebook className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Map */}
              <div className="w-full md:w-1/2 h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
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
          )}
        </div>
      </section>
    </main>
  );
}