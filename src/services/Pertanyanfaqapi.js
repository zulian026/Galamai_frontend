const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

// ========== PUBLIC FAQ ENDPOINTS ==========
export const fetchPublicFaqs = async ({ topikFilter, searchQuery }) => {
  try {
    const params = new URLSearchParams();
    if (topikFilter) params.append("topik", topikFilter);
    if (searchQuery) params.append("search", searchQuery);

    const response = await fetch(`${API_BASE_URL}/faqs?${params}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("Public FAQ Response:", data);

    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Gagal memuat data FAQ: " + err.message };
  }
};

export const fetchFaqTopics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/topics`, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("Topics Response:", data);

    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Gagal memuat topik: " + err.message };
  }
};

export const fetchFaqDetail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("FAQ Detail Response:", data);

    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Gagal memuat detail FAQ: " + err.message };
  }
};

// ========== ADMIN ENDPOINTS ==========
export const fetchPertanyaan = async ({ statusFilter, topikFilter, searchQuery }) => {
  try {
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (topikFilter) params.append("topik", topikFilter);
    if (searchQuery) params.append("search", searchQuery);

    const response = await fetch(`${API_BASE_URL}/admin/pertanyaan?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("Pertanyaan Response:", data);

    if (data.success) {
      let pertanyaanData = [];
      if (data.data.data && Array.isArray(data.data.data)) {
        pertanyaanData = data.data.data;
      } else if (Array.isArray(data.data)) {
        pertanyaanData = data.data;
      }
      return { success: true, data: pertanyaanData };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Gagal memuat data pertanyaan: " + err.message };
  }
};

export const fetchFaqs = async ({ topikFilter }) => {
  try {
    const params = new URLSearchParams();
    if (topikFilter) params.append("topik", topikFilter);

    const response = await fetch(`${API_BASE_URL}/admin/faqs?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("FAQ Response:", data);

    if (data.success) {
      let faqsData = [];
      if (data.data.data && Array.isArray(data.data.data)) {
        faqsData = data.data.data;
      } else if (Array.isArray(data.data)) {
        faqsData = data.data;
      }
      return { success: true, data: faqsData };
    } else {
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Gagal memuat data FAQ: " + err.message };
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/pertanyaan/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal memperbarui status" };
  }
};

export const createFaq = async (faqForm) => {
  try {
    console.log("Sending FAQ data:", faqForm);
    const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(faqForm),
    });

    const data = await response.json();
    console.log("Create FAQ response:", data);
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal membuat FAQ" };
  }
};

export const updateFaq = async (id, faqForm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(faqForm),
    });

    const data = await response.json();
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal memperbarui FAQ" };
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal menghapus FAQ" };
  }
};

export const toggleFaqActive = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/faqs/${id}/toggle-active`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal mengubah status" };
  }
};

export const deletePertanyaan = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/pertanyaan/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data.success
      ? { success: true }
      : { success: false, error: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Gagal menghapus pertanyaan" };
  }
};