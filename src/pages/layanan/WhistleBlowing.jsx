import React, { useState } from "react";
import { Info, Loader, CheckCircle, AlertCircle } from "lucide-react";
import heroBg from "../../assets/images/hero-bg.png";

export default function WhistleBlowingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nama_lengkap_user: "",
    tgl_lahir: "",
    profesi: "",
    alamat: "",
    email: "",
    kontak: "",
    indikasi_pelanggaran: "",
    lokasi_pelanggaran: "",
    oknum_pelanggaran: "",
    kronologi: "",
    data_pendukung: null,
  });

  const API_BASE_URL = "http://localhost:8000/api";

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 5MB");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Tipe file harus JPG, PNG, atau PDF");
        return;
      }
      setErrorMessage("");
      setFormData((prev) => ({ ...prev, data_pendukung: file }));
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nama_lengkap_user ||
      !formData.email ||
      !formData.kontak ||
      !formData.indikasi_pelanggaran ||
      !formData.kronologi
    ) {
      setErrorMessage("Harap isi semua field yang wajib");
      setSubmitStatus("error");
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);

      const submitData = new FormData();
      submitData.append("nama_lengkap_user", formData.nama_lengkap_user);
      submitData.append("tgl_lahir", formData.tgl_lahir || "");
      submitData.append("profesi", formData.profesi);
      submitData.append("alamat", formData.alamat);
      submitData.append("email", formData.email);
      submitData.append("kontak", formData.kontak);
      submitData.append("indikasi_pelanggaran", formData.indikasi_pelanggaran);
      submitData.append("lokasi_pelanggaran", formData.lokasi_pelanggaran);
      submitData.append("oknum_pelanggaran", formData.oknum_pelanggaran);
      submitData.append("kronologi", formData.kronologi);

      if (formData.data_pendukung) {
        submitData.append("data_pendukung", formData.data_pendukung);
      }

      const response = await fetch(`${API_BASE_URL}/whistleblowing`, {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengirim laporan");
      }

      setSubmitStatus("success");
      setErrorMessage("");

      setTimeout(() => {
        setFormData({
          nama_lengkap_user: "",
          tgl_lahir: "",
          profesi: "",
          alamat: "",
          email: "",
          kontak: "",
          indikasi_pelanggaran: "",
          lokasi_pelanggaran: "",
          oknum_pelanggaran: "",
          kronologi: "",
          data_pendukung: null,
        });
        setStep(1);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.message || "Terjadi kesalahan saat mengirim laporan"
      );
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Laporan Berhasil Dikirim
          </h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah melaporkan indikasi pelanggaran. Laporan Anda
            telah diterima dan akan diproses oleh admin.
          </p>
          <p className="text-sm text-gray-500">
            Anda akan diarahkan kembali ke formulir...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              Form Whistle Blowing
            </h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-90">
              Laporkan indikasi pelanggaran dengan aman dan rahasia.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8">
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

          <div className="col-span-3">
            <div
              className="bg-white shadow-lg rounded-xl p-8"
              onSubmit={handleSubmit}
            >
              {submitStatus === "error" && (
                <div className="flex items-start bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="flex items-start bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Isi identitas pelapor dengan benar. Identitas Anda akan
                      dilindungi dan dijaga kerahasiaannya.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      name="nama_lengkap_user"
                      value={formData.nama_lengkap_user}
                      onChange={handleChange}
                      label="Nama Lengkap"
                      required
                    />
                    <InputField
                      name="tgl_lahir"
                      value={formData.tgl_lahir}
                      onChange={handleChange}
                      label="Tanggal Lahir"
                      type="date"
                    />
                    <InputField
                      name="profesi"
                      value={formData.profesi}
                      onChange={handleChange}
                      label="Profesi"
                    />
                    <InputField
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      label="Alamat"
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
                      name="kontak"
                      value={formData.kontak}
                      onChange={handleChange}
                      label="No. HP/Telepon"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                    <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Lengkapi detail materi laporan pelanggaran dengan jelas
                      dan terperinci.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      name="indikasi_pelanggaran"
                      value={formData.indikasi_pelanggaran}
                      onChange={handleChange}
                      label="Indikasi Pelanggaran"
                      required
                    />
                    <InputField
                      name="lokasi_pelanggaran"
                      value={formData.lokasi_pelanggaran}
                      onChange={handleChange}
                      label="Lokasi/Tempat Pelanggaran"
                    />
                    <InputField
                      name="oknum_pelanggaran"
                      value={formData.oknum_pelanggaran}
                      onChange={handleChange}
                      label="Oknum yang Melakukan Pelanggaran"
                      className="md:col-span-2"
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
                      placeholder="Jelaskan secara detail apa, kapan, di mana, siapa, dan bagaimana pelanggaran terjadi..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                  <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Data Pendukung (Opsional - JPG, PNG, PDF, Max 5MB)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer block"
                      >
                        <div className="text-gray-600">
                          <p className="font-medium mb-1">
                            Klik untuk upload atau drag file di sini
                          </p>
                          <p className="text-sm text-gray-500">
                            Format: JPG, PNG, atau PDF (Max 5MB)
                          </p>
                        </div>
                      </label>
                      {formData.data_pendukung && (
                        <div className="mt-3 text-sm text-green-600 font-medium">
                          ✓ File dipilih: {formData.data_pendukung.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
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
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Laporan"
                    )}
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
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-14 border border-gray-300 rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required={required}
      />
    </div>
  );
}
