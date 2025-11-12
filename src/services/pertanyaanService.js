// src/services/pertanyaanService.js
import axios from "axios";

// 🔹 Transform data dari backend ke format frontend
const transformData = (item) => {
  return {
    id: item.id,
    namaLengkap: item.nama_lengkap,
    profesi: item.profesi,
    tanggalLahir: item.tanggal_lahir,
    alamat: item.alamat,
    email: item.email,
    noHp: item.no_hp,
    topik: item.topik,
    isiPertanyaan: item.isi_pertanyaan,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    faq: item.faq ? transformFaqData(item.faq) : null,
    ...item, // original data tetap ada
  };
};

const transformFaqData = (item) => {
  return {
    id: item.id,
    questionId: item.question_id,
    topik: item.topik,
    pertanyaan: item.pertanyaan,
    jawaban: item.jawaban,
    urutan: item.urutan,
    isActive: item.is_active,
    viewCount: item.view_count,
    publishedBy: item.published_by,
    publishedAt: item.published_at,
    ...item,
  };
};

export const pertanyaanService = {
  // 🔹 Submit pertanyaan (PUBLIC - tanpa token)
  submit: async (data) => {
    try {
      const backendData = {
        nama_lengkap: data.namaLengkap || data.nama_lengkap,
        profesi: data.profesi,
        tanggal_lahir: data.tanggalLahir || data.tanggal_lahir,
        alamat: data.alamat,
        email: data.email,
        no_hp: data.noHp || data.no_hp,
        topik: data.topik,
        isi_pertanyaan: data.isiPertanyaan || data.isi_pertanyaan,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pertanyaan`,
        backendData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in submit:", error);
      throw error;
    }
  },

  // 🔹 Get all pertanyaan dengan pagination (ADMIN)
  getAll: async (
    { page = 1, perPage = 15, status, topik, search } = {},
    token
  ) => {
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/pertanyaan?page=${page}&per_page=${perPage}`;

      if (status) url += `&status=${status}`;
      if (topik) url += `&topik=${encodeURIComponent(topik)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data?.data?.data) {
        response.data.data.data = response.data.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  // 🔹 Get pertanyaan by status (ADMIN)
  getByStatus: async (status, { page = 1, perPage = 15 } = {}, token) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/pertanyaan?status=${status}&page=${page}&per_page=${perPage}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data?.data) {
        response.data.data.data = response.data.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getByStatus:", error);
      throw error;
    }
  },

  // 🔹 Get pertanyaan by ID (ADMIN)
  getById: async (id, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pertanyaan/${id}`,
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

  // 🔹 Update status pertanyaan (ADMIN)
  updateStatus: async (id, status, token) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pertanyaan/${id}/status`,
        { status },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.data?.data) {
        response.data.data = transformData(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error in updateStatus:", error);
      throw error;
    }
  },

  // 🔹 Delete pertanyaan (ADMIN)
  delete: async (id, token) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/pertanyaan/${id}`,
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

  // 🔹 Get statistics pertanyaan (helper untuk dashboard)
  getStats: async (token) => {
    try {
      const response = await pertanyaanService.getAll({ perPage: 1000 }, token);

      if (response.success && response.data?.data) {
        const data = response.data.data;
        return {
          total: data.length,
          pending: data.filter((item) => item.status === "pending").length,
          processed: data.filter((item) => item.status === "processed").length,
          published: data.filter((item) => item.status === "published").length,
          rejected: data.filter((item) => item.status === "rejected").length,
        };
      }

      return {
        total: 0,
        pending: 0,
        processed: 0,
        published: 0,
        rejected: 0,
      };
    } catch (error) {
      console.error("Error in getStats:", error);
      throw error;
    }
  },
};
