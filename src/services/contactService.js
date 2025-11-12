import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/contact-info";

export const getContactInfo = async () => {
  return axios.get(API_URL);
};

export const updateContactInfo = async (data, token) => {
  return axios.put(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};