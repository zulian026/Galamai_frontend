import React, { useState, useEffect } from "react";

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    id_role: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hook selalu dipanggil, tidak kondisional
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/roles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Gagal memuat role");
        const data = await res.json();

        // Fix: Handle paginated response structure
        // Laravel paginate returns: { data: { data: [...], current_page: 1, ... } }
        if (data.data && data.data.data && Array.isArray(data.data.data)) {
          setRoles(data.data.data);
        } else if (Array.isArray(data.data)) {
          setRoles(data.data);
        } else if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.warn("Unexpected roles data structure:", data);
          setRoles([]);
        }
      } catch (err) {
        console.error("Fetch roles error:", err);
        setRoles([]); // Ensure roles is always an array
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Gagal menambahkan user. Status: ${res.status}`);
      }

      const data = await res.json();
      alert("User berhasil ditambahkan ✅");

      setFormData({ nama: "", email: "", password: "", id_role: "" });

      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      console.error("Tambah user gagal:", err);
      setError("Gagal menambahkan user");
    } finally {
      setLoading(false);
    }
  };

  // return null di bawah, bukan di atas
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tambah User</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="id_role"
              value={formData.id_role}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Role --</option>
              {/* Add safety check to ensure roles is array before mapping */}
              {Array.isArray(roles) &&
                roles.map((role) => (
                  <option key={role.id_role} value={role.id_role}>
                    {role.nm_role}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
