"use client";
import React, { useState } from "react";
import { MapPin, Info, Upload, X, FileText, Image } from "lucide-react";
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
    attachments: [],
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`File ${file.name} terlalu besar. Maksimal 5MB per file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const attachment = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: event.target.result,
        };

        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, attachment],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== id),
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (type) => {
    return type.startsWith("image/");
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data dikirim:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mb-65">
      {/* HERO */}
      <section>
        <div
          className="relative h-80 flex items-center justify-center bg-cover bg-center"
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
            <div className="bg-white shadow-lg rounded-xl p-8">
              {/* Step 1: Identitas Pelapor */}
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

              {/* Step 2: Identitas Produk */}
              {step === 2 && (
                <div>
                  <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                    <p className="text-sm text-yellow-700">
                      Cantumkan informasi produk selengkap mungkin untuk
                      memudahkan penelusuran. Anda dapat melampirkan foto produk
                      atau dokumen pendukung.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
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

                  {/* File Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Lampirkan File atau Foto
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Upload foto produk, kemasan, label, atau dokumen
                        pendukung lainnya
                        <br />
                        <span className="text-sm text-gray-500">
                          (Maksimal 5MB per file)
                        </span>
                      </p>
                      <label className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        Pilih File
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-3">
                        Format yang didukung: JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>
                  </div>

                  {/* File Preview Section */}
                  {formData.attachments.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          File Terlampir
                        </h4>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {formData.attachments.length} file
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 relative group hover:shadow-md transition-shadow"
                          >
                            <button
                              type="button"
                              onClick={() => removeAttachment(attachment.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <div className="text-center">
                              {isImageFile(attachment.type) ? (
                                <div className="mb-3">
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <div className="flex items-center justify-center mt-2">
                                    <Image className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-xs text-green-600 font-medium">
                                      Gambar
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-3">
                                  <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <div className="flex items-center justify-center mt-2">
                                    <FileText className="w-4 h-4 text-blue-500 mr-1" />
                                    <span className="text-xs text-blue-600 font-medium">
                                      Dokumen
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div>
                                <p
                                  className="text-sm font-medium text-gray-900 truncate"
                                  title={attachment.name}
                                >
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Pertanyaan */}
              {step === 3 && (
                <div>
                  <div className="flex items-start bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                    <p className="text-sm text-green-700">
                      Jelaskan masalah Anda dengan jelas dan detail. Sertakan
                      kronologi kejadian dan dampak yang dialami.
                    </p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3 text-lg">
                      Jelaskan pertanyaan atau masalah Anda{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pertanyaan"
                      value={formData.pertanyaan}
                      onChange={(e) =>
                        handleChange("pertanyaan", e.target.value)
                      }
                      rows="6"
                      placeholder="Ceritakan secara detail masalah yang Anda alami, kapan terjadi, dan dampaknya..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ← Kembali
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    📤 Kirim Pengaduan
                  </button>
                )}
              </div>
            </div>
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
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">-- Pilih --</option>
          <option value="produk-rusak">Produk Rusak/Cacat</option>
          <option value="efek-samping">Efek Samping</option>
          <option value="kemasan-rusak">Kemasan Rusak</option>
          <option value="pelayanan">Pelayanan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  );
}
