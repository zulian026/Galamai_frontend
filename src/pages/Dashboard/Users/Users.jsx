// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Search, Filter, User } from "lucide-react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("API Response:", result);

      // Karena paginate, user array ada di result.data.data
      setUsers(result.data?.data || []);
    } catch (err) {
      console.error("Fetch users failed:", err);
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin hapus user ${nama}?`)) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus user. Status: ${res.status}`);
      }

      setUsers((prev) => prev.filter((u) => u.id_user !== id));
    } catch (err) {
      console.error("Delete user failed:", err);
      alert("Gagal menghapus user");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Filter users berdasarkan search term
  const filteredUsers = users.filter(
    (user) =>
      user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.nm_role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm text-gray-600">Memuat data pengguna...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 text-red-500">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Terjadi Kesalahan</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Manajemen User
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kelola data pengguna sistem
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Tambah User
          </button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, atau role..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id_user}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.nama?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.nama || "Nama tidak tersedia"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id_user}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email || "Email tidak tersedia"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {user.role?.nm_role || "No Role"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                          onClick={() => handleDelete(user.id_user, user.nama)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">
                          {searchTerm
                            ? "Tidak ada data yang sesuai pencarian"
                            : "Belum ada data pengguna"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {searchTerm
                            ? "Coba ubah kata kunci pencarian"
                            : "Tambahkan pengguna baru untuk memulai"}
                        </div>
                      </div>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Hapus filter pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Menampilkan {filteredUsers.length} dari {users.length} pengguna
            </span>
            <span>Total: {users.length} pengguna terdaftar</span>
          </div>
        </div>
      )}

      {/* Modal Section */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  );
}
