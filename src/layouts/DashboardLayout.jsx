import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Shield,
  Users,
  Settings,
  Triangle,
  BookOpen,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo.png";

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Helper function to get user display name safely
  const getUserName = () => {
    return user?.nama || user?.name || "Guest";
  };

  // Helper function to get user role safely
  const getUserRole = () => {
    return user?.role?.nm_role || "No Role";
  };

  // Helper function to get user initials safely
  const getUserInitials = () => {
    const name = user?.nama || user?.name;
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "?";
  };

  // Semua menu
  const sections = [
    {
      title: "UTAMA",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          path: "/dashboard",
        },
      ],
    },
    {
      title: "LAYANAN",
      items: [
        {
          name: "Pengelolaan Pengaduan",
          icon: <HelpCircle className="w-5 h-5" />,
          path: "/dashboard/pengaduan",
        },
        {
          name: "Manajemen Faq",
          icon: <FileText className="w-5 h-5" />,
          path: "/dashboard/faq",
        },
        {
          name: "Whistle Blowing",
          icon: <Triangle className="w-5 h-5" />,
          path: "/dashboard/whistle",
        },
      ],
    },
    {
      title: "KONTEN",
      items: [
        {
          name: "Manajemen Konten",
          icon: <BookOpen className="w-5 h-5" />,
          path: "/dashboard/konten",
          children: [
            {
              name: "Artikel",
              path: "/dashboard/konten/artikel",
            },
            {
              name: "Aplikasi Layanan",
              path: "/dashboard/konten/Layanan_Aplikasi",
            },
            {
              name: "Berita",
              path: "/dashboard/konten/berita",
            },
          ],
        },
        {
          name: "Master Layanan",
          icon: <Shield className="w-5 h-5" />,
          path: "/dashboard/layanan",
        },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        {
          name: "Manajemen User",
          icon: <Users className="w-5 h-5" />,
          path: "/dashboard/users",
        },
        {
          name: "Profil Bpom",
          icon: <Settings className="w-5 h-5" />,
          path: "/dashboard/profil",
        },
      ],
    },
  ];

  // Role-based menu
  const roleBasedMenu = {
    "Super Admin": [
      "Dashboard",
      "Pengelolaan Pengaduan",
      "Manajemen Faq",
      "Whistle Blowing",
      "Manajemen Konten",
      "Master Layanan",
      "Manajemen User",
      "Profil Bpom",
    ],
    "Admin Web": [
      "Dashboard",
      "Manajemen Konten",
      "Master Layanan",
      "Profil Bpom",
    ],
    "Admin Pengaduan": ["Dashboard", "Pengelolaan Pengaduan", "Manajemen Faq"],
    "Admin Fungsi": ["Dashboard", "Pengelolaan Pengaduan"],
    "Admin Whistle Blowing": ["Dashboard", "Whistle Blowing"],
  };

  const [openMenus, setOpenMenus] = useState({});
  const userRole = getUserRole();
  const allowedMenu = roleBasedMenu[userRole] || [];

  // Route protection
  const allPaths = sections.flatMap((s) => s.items.map((i) => i.path));
  const allowedPaths = sections
    .flatMap((s) => s.items)
    .filter((i) => allowedMenu.includes(i.name))
    .map((i) => i.path);

  if (
    allPaths.includes(location.pathname) &&
    !allowedPaths.includes(location.pathname)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-100">
          <img src={logo} alt="Logo" className="h-8" />
          {sidebarOpen && (
            <span className="ml-3 text-lg font-semibold text-gray-800">
              BPOM
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {sections.map((section) => {
            const filteredItems = section.items.filter((item) =>
              allowedMenu.includes(item.name)
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                {sidebarOpen && (
                  <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 px-3">
                    {section.title}
                  </h2>
                )}
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const hasChildren =
                      item.children && item.children.length > 0;
                    const isOpen = openMenus[item.name];
                    const isActive = location.pathname === item.path;
                    const isChildActive =
                      hasChildren &&
                      item.children.some(
                        (child) => location.pathname === child.path
                      );

                    return (
                      <div key={item.path}>
                        {/* Parent Menu Item */}
                        {hasChildren ? (
                          <button
                            onClick={() =>
                              setOpenMenus((prev) => ({
                                ...prev,
                                [item.name]: !prev[item.name],
                              }))
                            }
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive || isChildActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={
                                  isActive || isChildActive
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }
                              >
                                {item.icon}
                              </span>
                              {sidebarOpen && <span>{item.name}</span>}
                            </div>
                            {hasChildren && sidebarOpen && (
                              <span className="text-gray-400">
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </span>
                            )}
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={
                                isActive ? "text-blue-600" : "text-gray-500"
                              }
                            >
                              {item.icon}
                            </span>
                            {sidebarOpen && <span>{item.name}</span>}
                          </Link>
                        )}

                        {/* Child Menu Items */}
                        {hasChildren && isOpen && sidebarOpen && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                  location.pathname === child.path
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {getUserName()}
                </div>
                <div className="text-xs text-gray-500">{getUserRole()}</div>
              </div>

              {/* Simple Avatar */}
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {getUserInitials()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
