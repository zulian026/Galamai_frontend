// src/routes/DashboardRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import DashboardSuperAdmin from "../pages/Dashboard/DashboardSuperAdmin";
import DashboardAdminWeb from "../pages/Dashboard/DashboardAdminWeb";
import DashboardAdminPengaduan from "../pages/Dashboard/DashboardAdminPengaduan";
import DashboardAdminFungsi from "../pages/Dashboard/DashboardAdminFungsi";
import DashboardAdminWhistle from "../pages/Dashboard/DashboardAdminWhistle";
import DashboardKepalaBalai from "../pages/Dashboard/DashboardKepalaBalai";

export default function DashboardRoute() {
  const { user } = useAuth();
  const role = user?.role?.nm_role;

  switch (role) {
    case "Super Admin":
      return <DashboardSuperAdmin />;
    case "Admin Web":
      return <DashboardAdminWeb />;
    case "Admin Pengaduan":
      return <DashboardAdminPengaduan />;
    case "Admin Fungsi":
      return <DashboardAdminFungsi />;
    case "Admin Whistle Blowing":
      return <DashboardAdminWhistle />;
    case "Kepala Balai":
      return <DashboardKepalaBalai />; // ✅ Menu baru

    default:
      return <Navigate to="/403" replace />;
  }
}
