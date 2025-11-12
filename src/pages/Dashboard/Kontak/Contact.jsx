import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  AlertCircle,
  Loader2,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

// Mock services - replace with actual imports
const getContactInfo = async () => {
  return { data: {} };
};

const updateContactInfo = async (data, token) => {
  return { data: { message: "Success" } };
};

function EditContact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    call_center_1: "",
    call_center_2: "",
    email: "",
    working_hours: "",
    twitter: "",
    youtube: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setFetching(true);
      const response = await getContactInfo();
      const data = response.data;

      setFormData({
        address: data.address || "",
        call_center_1: data.call_center_1 || "",
        call_center_2: data.call_center_2 || "",
        email: data.email || "",
        working_hours: data.working_hours || "",
        twitter: data.twitter || "",
        youtube: data.youtube || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Gagal memuat data kontak");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const response = await updateContactInfo(formData, token);
      setSuccess(response.data.message || "Data kontak berhasil diperbarui");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui data kontak");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Informasi Kontak
            </h1>
            <p className="text-gray-600 mt-1">
              Perbarui informasi kontak dan media sosial perusahaan
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-800 flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-3 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-800 flex-1">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="ml-3 text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Umum */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Umum
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Detail kontak dasar perusahaan
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Alamat
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Masukkan alamat lengkap"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
                disabled={loading}
              />
            </div>

            {/* Working Hours */}
            <div>
              <label
                htmlFor="working_hours"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                Jam Operasional
              </label>
              <input
                type="text"
                id="working_hours"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Senin - Jumat, 08:00 - 17:00"
                disabled={loading}
              />
            </div>

            {/* Call Centers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="call_center_1"
                  className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                >
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Call Center 1
                </label>
                <input
                  type="text"
                  id="call_center_1"
                  name="call_center_1"
                  value={formData.call_center_1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+62 xxx xxxx xxxx"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="call_center_2"
                  className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                >
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Call Center 2
                </label>
                <input
                  type="text"
                  id="call_center_2"
                  name="call_center_2"
                  value={formData.call_center_2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+62 xxx xxxx xxxx"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900">
              Media Sosial
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Link akun media sosial perusahaan
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Instagram */}
            <div>
              <label
                htmlFor="instagram"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://instagram.com/username"
                disabled={loading}
              />
            </div>

            {/* Facebook */}
            <div>
              <label
                htmlFor="facebook"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://facebook.com/username"
                disabled={loading}
              />
            </div>

            {/* Twitter */}
            <div>
              <label
                htmlFor="twitter"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                Twitter/X
              </label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://twitter.com/username"
                disabled={loading}
              />
            </div>

            {/* YouTube */}
            <div>
              <label
                htmlFor="youtube"
                className="flex items-center text-sm font-semibold text-gray-700 mb-2"
              >
                <Youtube className="w-4 h-4 mr-2 text-red-600" />
                YouTube
              </label>
              <input
                type="text"
                id="youtube"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://youtube.com/@channel"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              <X className="w-5 h-5 mr-2" />
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditContact;
