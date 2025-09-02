"use client";
import React, { useState } from "react";
import { MapPin, Info } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png";

export default function PengaduanPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    umur: "",
    namaPerusahaan: "",
    jenisPerusahaan: "",
    jenisPengaduan: "",
    jenisProduk: "",
    tanggal: "",
    jam: "",
    email: "",
    noTelepon: "",
    alamat: "",
    namaProduk: "",
    noRegistrasi: "",
    kadaluarsa: "",
    namaPabrik: "",
    alamatPabrik: "",
    batch: "",
    pertanyaan: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data dikirim:", formData);
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
              Form Pengaduan
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Sampaikan pengaduan Anda terkait produk dan layanan kepada kami.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* LEFT COLUMN: Vertical Step Line */}
          <div className="col-span-1 flex flex-col items-start relative">
            {["Identitas Pelapor", "Identitas Produk", "Pertanyaan"].map(
              (label, index) => (
                <div key={index} className="flex items-start mb-8 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white
                    ${step >= index + 1 ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-1 h-16 mt-1 ${
                          step > index + 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                  <span className="ml-4 mt-1 text-gray-700 font-medium">
                    {label}
                  </span>
                </div>
              )
            )}
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="col-span-3">
            <form
              className="bg-white shadow-lg rounded-xl p-8"
              onSubmit={handleSubmit}
            >
              {/* Info Box */}
              {step === 1 && (
                <div>
                  <div className="flex items-start bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <p className="text-sm text-blue-700">
                      Isi data pribadi Anda dengan benar. Pastikan informasi
                      sesuai identitas resmi.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      label="Nama Lengkap"
                      required
                    />
                    <InputField
                      name="umur"
                      value={formData.umur}
                      onChange={handleChange}
                      label="Umur"
                      required
                      type="number"
                    />
                    <InputField
                      name="namaPerusahaan"
                      value={formData.namaPerusahaan}
                      onChange={handleChange}
                      label="Nama Perusahaan"
                      required
                    />
                    <InputField
                      name="jenisPerusahaan"
                      value={formData.jenisPerusahaan}
                      onChange={handleChange}
                      label="Jenis Perusahaan"
                      required
                    />
                    <InputField
                      name="jenisPengaduan"
                      value={formData.jenisPengaduan}
                      onChange={handleChange}
                      label="Pilih Jenis Pengaduan"
                      required
                      type="select"
                    />
                    <InputField
                      name="jenisProduk"
                      value={formData.jenisProduk}
                      onChange={handleChange}
                      label="Pilih Jenis Produk"
                      required
                      type="select"
                    />
                    <InputField
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleChange}
                      label="Tanggal"
                      required
                      type="date"
                    />
                    <InputField
                      name="jam"
                      value={formData.jam}
                      onChange={handleChange}
                      label="Jam"
                      required
                      type="time"
                    />
                    <InputField
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      label="Email"
                      required
                      type="email"
                    />
                    <InputField
                      name="noTelepon"
                      value={formData.noTelepon}
                      onChange={handleChange}
                      label="No Telepon"
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
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                    <p className="text-sm text-yellow-700">
                      Cantumkan informasi produk selengkap mungkin untuk
                      memudahkan penelusuran.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      name="namaProduk"
                      value={formData.namaProduk}
                      onChange={handleChange}
                      label="Nama Produk"
                      required
                    />
                    <InputField
                      name="noRegistrasi"
                      value={formData.noRegistrasi}
                      onChange={handleChange}
                      label="No. Registrasi"
                    />
                    <InputField
                      name="kadaluarsa"
                      value={formData.kadaluarsa}
                      onChange={handleChange}
                      label="Tanggal Kadaluarsa"
                      type="date"
                    />
                    <InputField
                      name="namaPabrik"
                      value={formData.namaPabrik}
                      onChange={handleChange}
                      label="Nama Pabrik"
                    />
                    <InputField
                      name="alamatPabrik"
                      value={formData.alamatPabrik}
                      onChange={handleChange}
                      label="Alamat Pabrik"
                      className="md:col-span-2"
                    />
                    <InputField
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      label="Nomor Batch"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-start bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                    <p className="text-sm text-green-700">
                      Jelaskan masalah Anda dengan jelas dan detail. Sertakan
                      bukti atau informasi tambahan jika ada.
                    </p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Jelaskan pertanyaan atau masalah Anda{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pertanyaan"
                      value={formData.pertanyaan}
                      onChange={(e) =>
                        handleChange("pertanyaan", e.target.value)
                      }
                      rows="5"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
                  >
                    Kembali
                  </button>
                ) : (
                  <div></div>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-header text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-header text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Kirim Pengaduan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
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
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Pilih --</option>
          <option value="opsi1">Opsi 1</option>
          <option value="opsi2">Opsi 2</option>
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
