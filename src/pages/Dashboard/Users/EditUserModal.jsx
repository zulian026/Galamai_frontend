// src/components/EditUserModal.jsx
import React, { useEffect, useState } from "react";

export default function EditUserModal({ isOpen, onClose, onSuccess, user }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // preload user data
  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setEmail(user.email || "");
      setPassword(""); // Always start with empty password
      setRoleId(user.role_id || user.id_role || ""); // handle both possible field names
    }
  }, [user]);

  // fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Gagal load roles");

        const data = await res.json();

        // Fix: Handle paginated response structure properly
        // Laravel paginate returns: { data: { data: [...], current_page: 1, ... } }
        let rolesArray = [];
        if (data.data && data.data.data && Array.isArray(data.data.data)) {
          rolesArray = data.data.data;
        } else if (Array.isArray(data.data)) {
          rolesArray = data.data;
        } else if (Array.isArray(data)) {
          rolesArray = data;
        } else {
          console.warn("Unexpected roles data structure:", data);
          rolesArray = [];
        }

        setRoles(rolesArray);
      } catch (err) {
        console.error("Gagal load roles:", err);
        setRoles([]); // fallback biar gak error map
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare request body - only include password if it's not empty
      const requestBody = {
        nama,
        email,
        id_role: roleId,
      };

      // Only add password to request if user entered one
      if (password.trim() !== "") {
        requestBody.password = password;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/users/${user.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) throw new Error(`Gagal update. Status: ${res.status}`);

      const result = await res.json();
      alert("User berhasil diupdate ✅");

      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Update user failed:", err);
      alert("Gagal update user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
              <span className="text-xs text-gray-500 ml-2">
                (kosongkan jika tidak ingin mengubah)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              minLength={6}
              placeholder="Masukkan password baru (opsional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Role --</option>
              {/* Add safety check to ensure roles is array before mapping */}
              {Array.isArray(roles) &&
                roles.map((r) => (
                  <option key={r.id_role} value={r.id_role}>
                    {r.nm_role}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
