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
    status: item.status, // ✅ status (draft / publish)
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

  // 🔹 Ambil artikel berdasarkan status (draft / publish)
  getByStatus: async (
    status = "publish",
    { page = 1, perPage = 10 } = {},
    token
  ) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/artikel?status=${status}&page=${page}&per_page=${perPage}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getByStatus:", error);
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

  // 🔹 Tambah artikel baru (default draft)
  add: async (data, token) => {
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tanggal:
        data.created_at ||
        data.tanggal ||
        new Date().toISOString().split("T")[0],
      status: data.status || "draft", // ✅ default draft
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
    console.log("Update called with data:", data); // 🔍 Debug log

    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      tanggal: data.created_at || data.tanggal,
      // 🔹 FIX: Pastikan status selalu terkirim dengan benar
      status: data.status, // Hapus || undefined agar status selalu terkirim
    };

    // 🔹 Hanya kirim gambar jika ada file baru
    if (data.image && data.image instanceof File) {
      backendData.gambar = data.image;
    }

    console.log("Backend data being sent:", backendData); // 🔍 Debug log

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

  // 🔹 Alternative: Update dengan JSON jika backend support
  updateJSON: async (id, data, token) => {
    try {
      const backendData = {
        judul: data.title || data.judul,
        isi: data.description || data.isi,
        tanggal: data.created_at || data.tanggal,
        status: data.status, // Status akan terkirim dengan benar
      };

      // Jika ada gambar baru, upload terpisah
      if (data.image && data.image instanceof File) {
        const uploadResponse = await artikelService.uploadImage(
          data.image,
          token
        );
        if (uploadResponse.success) {
          backendData.gambar = uploadResponse.path || uploadResponse.url;
        }
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/artikel/${id}`,
        backendData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in updateJSON:", error);
      throw error;
    }
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

  // 🔹 Publish artikel
  publish: async (id, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/artikel/${id}/publish`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in publish:", error);
      throw error;
    }
  },
};
