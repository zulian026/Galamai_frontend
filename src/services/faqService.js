// src/services/faqService.js
import axios from "axios";

// 🔹 Transform data dari backend ke format frontend
const transformData = (item) => {
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
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    pertanyaan_detail: item.pertanyaan
      ? {
          id: item.pertanyaan.id,
          namaLengkap: item.pertanyaan.nama_lengkap,
          email: item.pertanyaan.email,
          ...item.pertanyaan,
        }
      : null,
    publisher: item.publisher
      ? {
          idUser: item.publisher.id_user,
          nama: item.publisher.nama,
          ...item.publisher,
        }
      : null,
    ...item, // original data tetap ada
  };
};

export const faqService = {
  // ====================================
  // PUBLIC ENDPOINTS (tanpa token)
  // ====================================

  // 🔹 Get all FAQ (PUBLIC)
  getAll: async ({ topik, search } = {}) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/faq`;
      const params = [];

      if (topik) params.push(`topik=${encodeURIComponent(topik)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);

      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await axios.get(url);

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  // 🔹 Get FAQ by ID (PUBLIC) - increment view count
  getById: async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/faq/${id}`
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

  // 🔹 Get available topics (PUBLIC)
  getTopics: async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/faq-topics`
      );

      return response.data;
    } catch (error) {
      console.error("Error in getTopics:", error);
      throw error;
    }
  },

  // 🔹 Get FAQ by topic (PUBLIC)
  getByTopic: async (topik) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/faq?topik=${encodeURIComponent(
          topik
        )}`
      );

      if (response.data?.data) {
        response.data.data = response.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in getByTopic:", error);
      throw error;
    }
  },

  // ====================================
  // ADMIN ENDPOINTS (butuh token)
  // ====================================

  // 🔹 Get all FAQ for admin (termasuk yang inactive)
  adminGetAll: async (
    { page = 1, perPage = 15, isActive, topik } = {},
    token
  ) => {
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/admin/faq?page=${page}&per_page=${perPage}`;

      if (isActive !== undefined) url += `&is_active=${isActive ? 1 : 0}`;
      if (topik) url += `&topik=${encodeURIComponent(topik)}`;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data?.data?.data) {
        response.data.data.data = response.data.data.data.map(transformData);
      }

      return response.data;
    } catch (error) {
      console.error("Error in adminGetAll:", error);
      throw error;
    }
  },

  // 🔹 Create FAQ (ADMIN)
  create: async (data, token) => {
    try {
      const backendData = {
        question_id: data.questionId || data.question_id || null,
        topik: data.topik,
        pertanyaan: data.pertanyaan,
        jawaban: data.jawaban,
        urutan: data.urutan || 0,
        is_active: data.isActive !== undefined ? data.isActive : true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/faq`,
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
      console.error("Error in create:", error);
      throw error;
    }
  },

  // 🔹 Update FAQ (ADMIN)
  update: async (id, data, token) => {
    try {
      const backendData = {};

      // Hanya kirim field yang ada
      if (data.topik !== undefined) backendData.topik = data.topik;
      if (data.pertanyaan !== undefined)
        backendData.pertanyaan = data.pertanyaan;
      if (data.jawaban !== undefined) backendData.jawaban = data.jawaban;
      if (data.urutan !== undefined) backendData.urutan = data.urutan;
      if (data.isActive !== undefined) backendData.is_active = data.isActive;

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/faq/${id}`,
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
      console.error("Error in update:", error);
      throw error;
    }
  },

  // 🔹 Delete FAQ (ADMIN)
  delete: async (id, token) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/faq/${id}`,
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

  // 🔹 Toggle active status (ADMIN)
  toggleActive: async (id, token) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/faq/${id}/toggle-active`,
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
      console.error("Error in toggleActive:", error);
      throw error;
    }
  },

  // 🔹 Create FAQ from existing question (ADMIN)
  createFromQuestion: async (questionId, data, token) => {
    try {
      const backendData = {
        question_id: questionId,
        topik: data.topik,
        pertanyaan: data.pertanyaan,
        jawaban: data.jawaban,
        urutan: data.urutan || 0,
        is_active: data.isActive !== undefined ? data.isActive : true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/faq`,
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
      console.error("Error in createFromQuestion:", error);
      throw error;
    }
  },

  // 🔹 Get FAQ statistics (helper untuk dashboard)
  getStats: async (token) => {
    try {
      const response = await faqService.adminGetAll({ perPage: 1000 }, token);

      if (response.success && response.data?.data) {
        const data = response.data.data;

        // Group by topic
        const topicCounts = {};
        data.forEach((item) => {
          topicCounts[item.topik] = (topicCounts[item.topik] || 0) + 1;
        });

        // Total views
        const totalViews = data.reduce(
          (sum, item) => sum + (item.viewCount || 0),
          0
        );

        // Most viewed
        const mostViewed = [...data]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5);

        return {
          total: data.length,
          active: data.filter((item) => item.isActive).length,
          inactive: data.filter((item) => !item.isActive).length,
          totalViews,
          topicCounts,
          mostViewed: mostViewed.map((item) => ({
            id: item.id,
            pertanyaan: item.pertanyaan,
            viewCount: item.viewCount,
          })),
        };
      }

      return {
        total: 0,
        active: 0,
        inactive: 0,
        totalViews: 0,
        topicCounts: {},
        mostViewed: [],
      };
    } catch (error) {
      console.error("Error in getStats:", error);
      throw error;
    }
  },
};
