"use client";
import React, { useState } from "react";
import { MapPin, Info, CheckCircle, XCircle, Loader2 } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png";
import { pertanyaanService } from "../../services/pertanyaanService";

export default function PertanyaanPage() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    profesi: "",
    tanggalLahir: "",
    alamat: "",
    email: "",
    noHp: "",
    topik: "",
    isiPertanyaan: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear status saat user mulai edit lagi
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await pertanyaanService.submit(formData);

      if (response.success) {
        setSubmitStatus("success");

        // Reset form setelah berhasil
        setTimeout(() => {
          setFormData({
            namaLengkap: "",
            profesi: "",
            tanggalLahir: "",
            alamat: "",
            email: "",
            noHp: "",
            topik: "",
            isiPertanyaan: "",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting pertanyaan:", error);
      setSubmitStatus("error");

      // Handle error message
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        setErrorMessage(Array.isArray(firstError) ? firstError[0] : firstError);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Gagal mengirim pertanyaan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mb-65">
      {/* Hero */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-header/95 "></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {" "}
              Form Pertanyaan
            </h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-90">
              Ajukan pertanyaan Anda terkait produk dan layanan kepada kami.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="container mx-auto px-6 md:px-12 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8"
        >
          {/* Info Box */}
          <div className="flex items-start bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Mohon isi data dengan benar agar kami dapat menindaklanjuti
              pertanyaan Anda.
            </p>
          </div>

          {/* Success Alert */}
          {submitStatus === "success" && (
            <div className="flex items-start bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">
                  Pertanyaan Berhasil Dikirim!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Terima kasih. Tim kami akan segera merespons pertanyaan Anda.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {submitStatus === "error" && (
            <div className="flex items-start bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-fadeIn">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Gagal Mengirim Pertanyaan
                </p>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Identitas */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Identitas
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InputField
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              label="Nama Lengkap"
              required
              disabled={loading}
            />
            <InputField
              name="profesi"
              value={formData.profesi}
              onChange={handleChange}
              label="Profesi"
              disabled={loading}
            />
            <InputField
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              label="Tanggal Lahir"
              type="date"
              required
              disabled={loading}
            />
            <InputField
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              label="Alamat"
              required
              disabled={loading}
              className="md:col-span-2"
            />
          </div>

          {/* Data Akun */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Akun
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InputField
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              type="email"
              required
              disabled={loading}
            />
            <InputField
              name="noHp"
              value={formData.noHp}
              onChange={handleChange}
              label="No. HP"
              required
              disabled={loading}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Pertanyaan */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pertanyaan
          </h2>
          <div className="grid gap-6">
            <InputField
              name="topik"
              value={formData.topik}
              onChange={handleChange}
              label="Topik"
              required
              disabled={loading}
              placeholder="Contoh: Perizinan Usaha, Pajak Daerah, dll"
            />
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Isi Pertanyaan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="isiPertanyaan"
                value={formData.isiPertanyaan}
                onChange={(e) => handleChange("isiPertanyaan", e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={loading}
                placeholder="Tulis pertanyaan Anda secara detail..."
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                Minimal 10 karakter. Jelaskan pertanyaan Anda dengan lengkap.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-header text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 min-w-[180px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Pertanyaan</span>
              )}
            </button>
          </div>
        </form>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function InputField({
  name,
  value,
  onChange,
  label,
  required,
  type = "text",
  className = "",
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
