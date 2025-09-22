// src/services/artikelService.js
import axios from "axios";

const handleFormDataRequest = async (
  endpoint,
  { method = "POST", token, data } = {}
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value instanceof File ? value : value.toString());
    }
  });

  const res = await axios({
    url: `${import.meta.env.VITE_API_URL}${endpoint}`,
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // biarkan axios set Content-Type sendiri
    },
    data: formData,
  });

  return res.data;
};

// 🔹 Transform data dari backend ke format frontend
const transformData = (item) => {
  return {
    id: item.id_artikel, // Backend: id_artikel → Frontend: id
    title: item.judul, // Backend: judul → Frontend: title
    description: item.isi, // Backend: isi → Frontend: description
    image: item.gambar, // path di storage
    image_url: item.image_url, // URL lengkap
    created_at: item.tanggal || item.created_at,
    views: item.views,
    ...item, // biar original tetap ada
  };
};

export const artikelService = {
  // 🔹 Ambil semua artikel tanpa pagination
  getAll: async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/artikel`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  // 🔹 Ambil artikel dengan pagination
  getPaginated: async ({ page = 1, perPage = 10 } = {}, token) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/artikel?page=${page}&per_page=${perPage}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data; // ✅ { success, data, meta }
    } catch (error) {
      console.error("Error in getPaginated:", error);
      throw error;
    }
  },

  // 🔹 Ambil artikel by ID
  getById: async (id, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/artikel/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  },

  // 🔹 Tambah artikel baru
  add: async (data, token) => {
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tanggal:
        data.created_at ||
        data.tanggal ||
        new Date().toISOString().split("T")[0],
    };

    const response = await handleFormDataRequest("/api/artikel", {
      method: "POST",
      token,
      data: backendData,
    });

    if (response?.data) {
      response.data = transformData(response.data);
    }

    return response;
  },

  // 🔹 Update artikel
  update: async (id, data, token) => {
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tanggal: data.created_at || data.tanggal,
    };

    const response = await handleFormDataRequest(
      `/api/artikel/${id}?_method=PUT`,
      {
        method: "POST",
        token,
        data: backendData,
      }
    );

    if (response?.data) {
      response.data = transformData(response.data);
    }

    return response;
  },

  // 🔹 Hapus artikel
  delete: async (id, token) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/artikel/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  },

  // 🔹 Upload image khusus artikel
  uploadImage: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/artikel/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  },
};
