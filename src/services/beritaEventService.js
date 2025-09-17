// src/services/beritaEventService.js
import axios from "axios";

const handleFormDataRequest = async (
  endpoint,
  { method = "POST", token, data } = {}
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      // Kalau File tetap file, kalau string/number diubah ke string
      formData.append(key, value instanceof File ? value : value.toString());
    }
  });

  const res = await axios({
    url: `${import.meta.env.VITE_API_URL}${endpoint}`,
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Jangan set Content-Type, biarkan axios otomatis
    },
    data: formData,
  });

  return res.data;
};

// 🔹 Transform data dari backend ke format yang diharapkan frontend
const transformData = (item) => {
  return {
    id: item.id_berita, // Backend: id_berita -> Frontend: id
    title: item.judul, // Backend: judul -> Frontend: title
    description: item.isi, // Backend: isi -> Frontend: description
    image: item.gambar, // Backend: gambar -> Frontend: image
    image_url: item.image_url, // URL lengkap dari backend
    type: item.tipe, // Backend: tipe -> Frontend: type
    created_at: item.tanggal || item.created_at, // Backend: tanggal -> Frontend: created_at
    views: item.views,
    // Keep original fields juga untuk backward compatibility
    ...item,
  };
};

export const beritaEventService = {
  getAll: async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/berita`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Transform data
      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  getById: async (id, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/berita/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Transform data
      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  },

  add: async (data, token) => {
    // Transform data ke format backend
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tipe: data.type || data.tipe,
      tanggal:
        data.created_at ||
        data.tanggal ||
        new Date().toISOString().split("T")[0],
    };

    const response = await handleFormDataRequest("/api/berita", {
      method: "POST",
      token,
      data: backendData,
    });

    // Transform response data
    if (response?.data) {
      response.data = transformData(response.data);
    }

    return response;
  },

  update: async (id, data, token) => {
    // Transform data ke format backend
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tipe: data.type || data.tipe,
      tanggal: data.created_at || data.tanggal,
    };

    const response = await handleFormDataRequest(
      `/api/berita/${id}?_method=PUT`,
      {
        method: "POST",
        token,
        data: backendData,
      }
    );

    // Transform response data
    if (response?.data) {
      response.data = transformData(response.data);
    }

    return response;
  },

  delete: async (id, token) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/berita/${id}`,
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

  // 🔹 Upload image method
  uploadImage: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/berita/upload-image`,
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
