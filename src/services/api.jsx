// src/services/api.jsx
const API_URL = import.meta.env.VITE_API_URL; // dev & prod

const request = async (endpoint, { method = "GET", token, body } = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error! status: ${res.status}`);
  }

  return res.json();
};

export default request;
