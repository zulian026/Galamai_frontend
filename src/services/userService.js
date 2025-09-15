// src/services/userService.js
import request from "./api";

export const userService = {
  getAll: (token) => request("/api/users", { token }),
  getById: (id, token) => request(`/api/users/${id}`, { token }),
  add: (data, token) =>
    request("/api/users", { method: "POST", body: data, token }),
  update: (id, data, token) =>
    request(`/api/users/${id}`, { method: "PUT", body: data, token }),
  delete: (id, token) =>
    request(`/api/users/${id}`, { method: "DELETE", token }),
};
