import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Shield,
  Users,
  Triangle,
  BookOpen,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
  X,
  MessageCircleQuestion,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo.png";

/* ============================
   MENU CONFIGURATION
============================ */
const MENU_SECTIONS = [
  {
    title: "UTAMA",
    items: [
      {
        key: "dashboard",
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
        key: "pengaduan",
        name: "Pengelolaan Pengaduan",
        icon: <HelpCircle className="w-5 h-5" />,
        path: "/dashboard/pengaduan",
      },
      {
        key: "whistle",
        name: "Whistle Blowing",
        icon: <Triangle className="w-5 h-5" />,
        path: "/dashboard/whistle",
      },
      {
        key: "pertanyaan",
        name: "Pertanyaan & Faq",
        icon: <MessageCircleQuestion className="w-5 h-5" />,
        path: "/dashboard/pertanyaan",
      },
      {
        key: "report_wb",
        name: "Laporan Wb",
        icon: <MessageCircleQuestion className="w-5 h-5" />,
        path: "/dashboard/Laporanwb",
      },
    ],
  },
  {
    title: "KONTEN",
    items: [
      {
        key: "konten",
        name: "Manajemen Konten",
        icon: <BookOpen className="w-5 h-5" />,
        path: "/dashboard/konten",
        children: [
          {
            key: "artikel",
            name: "Artikel",
            path: "/dashboard/konten/artikel",
          },
          {
            key: "layanan_aplikasi",
            name: "Aplikasi Layanan",
            path: "/dashboard/konten/layanan_aplikasi",
          },
          { key: "berita", name: "Berita", path: "/dashboard/berita" },
          { key: "profil", name: "Profil", path: "/dashboard/profil" },
          {
            key: "chart",
            name: "Chart Layanan",
            path: "/dashboard/chart-layanan",
          },
          { key: "kontak", name: "Kontak", path: "/dashboard/kontak" },
        ],
      },
      {
        key: "layanan_master",
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
        key: "user_management",
        name: "Manajemen User",
        icon: <Users className="w-5 h-5" />,
        path: "/dashboard/users",
      },
    ],
  },
];

/* ============================
   ROLE ACCESS CONFIG
============================ */
const ROLE_ACCESS = {
  "Super Admin": [
    "dashboard",
    "pengaduan",
    "faq",
    "whistle",
    "pertanyaan",
    "konten",
    "layanan_master",
    "user_management",
  ],
  "Admin Web": ["dashboard", "konten", "layanan_master"],
  "Admin Pengaduan": ["dashboard", "pengaduan", "faq", "pertanyaan"],
  "Admin Fungsi": ["dashboard"],
  "Admin Whistle Blowing": ["dashboard", "whistle"],
  "Kepala Balai": ["dashboard", "report_wb"],
};

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  /* ============================
     HANDLE RESPONSIVE BEHAVIOR
  ============================ */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  /* ============================
     HELPER FUNCTIONS
  ============================ */
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

  const getUserName = () => user?.nama || user?.name || "Guest";
  const getUserRole = () => user?.role?.nm_role || "No Role";
  const getUserInitials = () =>
    user?.nama ? user.nama.charAt(0).toUpperCase() : "?";

  const userRole = getUserRole();
  const allowedKeys = ROLE_ACCESS[userRole] || [];

  /* ============================
     ROUTE PROTECTION
  ============================ */
  const allPaths = MENU_SECTIONS.flatMap((s) =>
    s.items.flatMap((i) => [i.path, ...(i.children?.map((c) => c.path) || [])])
  );
  const allowedPaths = MENU_SECTIONS.flatMap((s) => s.items)
    .filter((i) => allowedKeys.includes(i.key))
    .flatMap((i) => [i.path, ...(i.children?.map((c) => c.path) || [])]);

  const currentPath = location.pathname;
  const isAllowed = allowedPaths.some((path) => currentPath.startsWith(path));

  if (allPaths.includes(currentPath) && !isAllowed) {
    return <Navigate to="/403" replace />;
  }

  /* ============================
     RENDER COMPONENT
  ============================ */
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - FIXED */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          ${
            isMobile
              ? `transform transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : sidebarOpen
              ? "w-64"
              : "w-16"
          }
          bg-header border-r border-gray-200 flex flex-col transition-all duration-300
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8" />
            {(sidebarOpen || isMobile) && (
              <span className="ml-3 text-lg font-semibold text-white">
                BPOM
              </span>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-gray-700 rounded text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {MENU_SECTIONS.map((section) => {
            const visibleItems = section.items.filter((i) =>
              allowedKeys.includes(i.key)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                {(sidebarOpen || isMobile) && (
                  <h2 className="text-xs font-medium text-white uppercase tracking-wide mb-3 px-3">
                    {section.title}
                  </h2>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const hasChildren = item.children?.length > 0;
                    const isOpen = openMenus[item.key];
                    const isActive = currentPath.startsWith(item.path);
                    const isChildActive =
                      hasChildren &&
                      item.children.some((c) => currentPath.startsWith(c.path));

                    return (
                      <div key={item.key}>
                        {hasChildren ? (
                          <button
                            onClick={() =>
                              setOpenMenus((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key],
                              }))
                            }
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive || isChildActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-white hover:bg-gray-700"
                            }`}
                            title={
                              !sidebarOpen && !isMobile ? item.name : undefined
                            }
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={
                                  isActive || isChildActive
                                    ? "text-blue-600"
                                    : "text-gray-300"
                                }
                              >
                                {item.icon}
                              </span>
                              {(sidebarOpen || isMobile) && (
                                <span>{item.name}</span>
                              )}
                            </div>
                            {(sidebarOpen || isMobile) &&
                              (isOpen ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              ))}
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-white hover:bg-gray-700"
                            }`}
                            title={
                              !sidebarOpen && !isMobile ? item.name : undefined
                            }
                          >
                            <span
                              className={
                                isActive ? "text-blue-600" : "text-gray-300"
                              }
                            >
                              {item.icon}
                            </span>
                            {(sidebarOpen || isMobile) && (
                              <span>{item.name}</span>
                            )}
                          </Link>
                        )}

                        {/* Children */}
                        {hasChildren && isOpen && (sidebarOpen || isMobile) && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.key}
                                to={child.path}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                  currentPath.startsWith(child.path)
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
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

      {/* Main Area - WITH MARGIN FOR SIDEBAR */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile ? (sidebarOpen ? "ml-64" : "ml-16") : ""
        }`}
      >
        {/* Header - FIXED */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {getUserName()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {getUserRole()}
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials()}
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content - SCROLLABLE */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
