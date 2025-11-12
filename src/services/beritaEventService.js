// src/services/beritaEventService.js
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
    },
    data: formData,
  });

  return res.data;
};

// 🔹 Transform data dari backend ke format frontend
const transformData = (item) => {
  return {
    id: item.id_berita, // Backend: id_berita → Frontend: id
    title: item.judul,
    description: item.isi,
    image: item.gambar,
    image_url: item.image_url,
    type: item.tipe,
    created_at: item.tanggal || item.created_at,
    views: item.views,
    status: item.status, // ✅ status (draft / publish)
    ...item,
  };
};

export const beritaEventService = {
  // 🔹 Ambil semua berita tanpa pagination
  getAll: async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/berita`,
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

  // 🔹 Ambil berita dengan pagination
  getPaginated: async (
    { page = 1, perPage = 10, type, search, sort } = {},
    token
  ) => {
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/berita?page=${page}&per_page=${perPage}`;

      // ✅ Tambahkan filter type jika ada
      if (type) {
        url += `&type=${type}`;
      }

      // ✅ Tambahkan search jika ada
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // ✅ Tambahkan sort jika ada
      if (sort) {
        url += `&sort=${sort}`;
      }

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getPaginated:", error);
      throw error;
    }
  },

  // 🔹 ✅ UPDATED: Ambil berita berdasarkan status (draft / publish) dengan support untuk type, search, sort
  getByStatus: async (
    status = "publish",
    { page = 1, perPage = 10, type, search, sort } = {},
    token
  ) => {
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/berita?status=${status}&page=${page}&per_page=${perPage}`;

      // ✅ Tambahkan filter type jika ada
      if (type) {
        url += `&type=${type}`;
      }

      // ✅ Tambahkan search jika ada
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // ✅ Tambahkan sort jika ada
      if (sort) {
        url += `&sort=${sort}`;
      }

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getByStatus:", error);
      throw error;
    }
  },

  // 🔹 Ambil berita by ID
  getById: async (id, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/berita/${id}`,
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

  // 🔹 Tambah berita baru (default draft)
  add: async (data, token) => {
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      gambar: data.image || data.gambar,
      tipe: data.type || data.tipe,
      tanggal:
        data.created_at ||
        data.tanggal ||
        new Date().toISOString().split("T")[0],
      status: data.status || "draft", // ✅ default draft
    };

    const response = await handleFormDataRequest("/api/berita", {
      method: "POST",
      token,
      data: backendData,
    });

    if (response?.data) {
      response.data = transformData(response.data);
    }

    return response;
  },

  // 🔹 Update berita
  update: async (id, data, token) => {
    const backendData = {
      judul: data.title || data.judul,
      isi: data.description || data.isi,
      tipe: data.type || data.tipe,
      tanggal: data.created_at || data.tanggal,
      status: data.status, // ✅ ikut update status
    };

    if (data.image && data.image instanceof File) {
      backendData.gambar = data.image;
    }

    const response = await handleFormDataRequest(
      `/api/berita/${id}?_method=PUT`,
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

  // 🔹 Hapus berita
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

  // 🔹 Upload image khusus berita
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

  // 🔹 Publish berita
  publish: async (id, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/berita/${id}/publish`,
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
