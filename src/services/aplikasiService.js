// src/services/aplikasiService.js
import request from "./api";

/**
 * Untuk endpoint Laravel, jika ada file, gunakan FormData.
 * request() di api.jsx hanya untuk JSON, jadi kita buat handling khusus di sini.
 */
const handleFormDataRequest = async (
  endpoint,
  { method = "POST", token, data } = {}
) => {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error! status: ${res.status}`);
  }

  return res.json();
};

export const aplikasiService = {
  getAll: () => request("/api/aplikasi"), // public route
  getById: (id) => request(`/api/aplikasi/${id}`),

  // data = { nama_app, url, kategori, deskripsi, image }
  add: (data, token) =>
    handleFormDataRequest("/api/aplikasi", { method: "POST", token, data }),

  update: (id, data, token) =>
    handleFormDataRequest(`/api/aplikasi/${id}?_method=PUT`, {
      method: "POST",
      token,
      data,
    }),

  delete: (id, token) =>
    request(`/api/aplikasi/${id}`, { method: "DELETE", token }),
};
