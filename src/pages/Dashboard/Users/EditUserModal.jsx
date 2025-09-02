// src/components/EditUserModal.jsx
import React, { useEffect, useState } from "react";

export default function EditUserModal({ isOpen, onClose, onSuccess, user }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // preload user data
  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setEmail(user.email || "");
      setRoleId(user.role_id || "");
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
        const data = await res.json();
        setRoles(data.data || data);
      } catch (err) {
        console.error("Gagal load roles:", err);
      }
    };
    if (isOpen) fetchRoles();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/${user.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ nama, email, role_id: roleId }),
        }
      );

      if (!res.ok) throw new Error(`Gagal update. Status: ${res.status}`);

      onSuccess();
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
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">-- Pilih Role --</option>
              {roles.map((r) => (
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
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
