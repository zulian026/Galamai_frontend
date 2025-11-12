import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/chart-layanan";

export const getChartLayanan = async () => {
  return axios.get(API_URL);
};

export const getChartLayananById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createChartLayanan = async (data, token) => {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateChartLayanan = async (id, data, token) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteChartLayanan = async (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
