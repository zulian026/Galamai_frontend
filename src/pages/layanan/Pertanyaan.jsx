"use client";
import React, { useState } from "react";
import { MapPin, Info } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png";

export default function PertanyaanPage() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    profesi: "",
    tanggalLahir: "",
    alamat: "",
    email: "",
    noHp: "",
    topik: "",
    pertanyaan: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Pertanyaan:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mb-65 ">
      {/* HERO */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Form Pertanyaan
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
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
            <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <p className="text-sm text-blue-700">
              Mohon isi data dengan benar agar kami dapat menindaklanjuti
              pertanyaan Anda.
            </p>
          </div>

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
            />
            <InputField
              name="profesi"
              value={formData.profesi}
              onChange={handleChange}
              label="Profesi"
            />
            <InputField
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              label="Tanggal Lahir"
              type="date"
              required
            />
            <InputField
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              label="Alamat"
              required
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
            />
            <InputField
              name="noHp"
              value={formData.noHp}
              onChange={handleChange}
              label="No. HP"
              required
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
            />
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Isi Pertanyaan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pertanyaan"
                value={formData.pertanyaan}
                onChange={(e) => handleChange("pertanyaan", e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-header text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Kirim Pertanyaan
            </button>
          </div>
        </form>
      </section>
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
        className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
}
