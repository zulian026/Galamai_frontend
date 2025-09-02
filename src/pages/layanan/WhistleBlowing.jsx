"use client";
import React, { useState } from "react";
import { Info } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png";

export default function WhistleBlowingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    tanggalLahir: "",
    profesi: "",
    alamat: "",
    email: "",
    noHp: "",
    indikasiPelanggaran: "",
    lokasi: "",
    waktu: "",
    oknum: "",
    kronologi: "",
    dataPendukung: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Whistle Blowing Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HERO */}
      <section>
        <div
          className="relative h-80 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Form Whistle Blowing
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Laporkan indikasi pelanggaran dengan aman dan rahasia.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* LEFT COLUMN: Step Indicator */}
          <div className="col-span-1 flex flex-col items-start relative">
            {["Identitas Pelapor & Data Akun", "Materi Laporan"].map(
              (label, index) => (
                <div key={index} className="flex items-start mb-8 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white
                    ${step >= index + 1 ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      {index + 1}
                    </div>
                    {index < 1 && (
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
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <div className="flex items-start bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <p className="text-sm text-blue-700">
                      Isi identitas pelapor dan data akun Anda dengan benar.
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
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleChange}
                      label="Tanggal Lahir"
                      type="date"
                      required
                    />
                    <InputField
                      name="profesi"
                      value={formData.profesi}
                      onChange={handleChange}
                      label="Profesi"
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
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                    <p className="text-sm text-yellow-700">
                      Lengkapi detail materi laporan pelanggaran.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      name="indikasiPelanggaran"
                      value={formData.indikasiPelanggaran}
                      onChange={handleChange}
                      label="Indikasi Pelanggaran"
                      required
                    />
                    <InputField
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      label="Lokasi/Tempat Pelanggaran"
                      required
                    />
                    <InputField
                      name="waktu"
                      value={formData.waktu}
                      onChange={handleChange}
                      label="Waktu Kejadian"
                      type="datetime-local"
                      required
                    />
                    <InputField
                      name="oknum"
                      value={formData.oknum}
                      onChange={handleChange}
                      label="Oknum yang Melakukan Pelanggaran"
                    />
                  </div>
                  <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Kronologi Pelanggaran{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="kronologi"
                      value={formData.kronologi}
                      onChange={(e) =>
                        handleChange("kronologi", e.target.value)
                      }
                      rows="5"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                  <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Data Pendukung (Opsional)
                    </label>
                    <textarea
                      name="dataPendukung"
                      value={formData.dataPendukung}
                      onChange={(e) =>
                        handleChange("dataPendukung", e.target.value)
                      }
                      rows="4"
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
                {step < 2 ? (
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
                    Kirim Laporan
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
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
