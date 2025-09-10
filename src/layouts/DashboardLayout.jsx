import { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo.png";

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default false for mobile
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout, loading } = useAuth();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${
            isMobile
              ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "relative"
          }
          ${!isMobile && sidebarOpen ? "w-64" : !isMobile ? "w-16" : "w-64"}
          bg-header border-r border-gray-200 flex flex-col
          ${!isMobile ? "transition-all duration-300" : ""}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8" />
            {(sidebarOpen || isMobile) && (
              <span className="ml-3 text-lg font-semibold text-white">
                BPOM
              </span>
            )}
          </div>

          {/* Close button for mobile */}
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
          {sections.map((section) => {
            const filteredItems = section.items.filter((item) =>
              allowedMenu.includes(item.name)
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                {(sidebarOpen || isMobile) && (
                  <h2 className="text-xs font-medium text-white uppercase tracking-wide mb-3 px-3">
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
                            {hasChildren && (sidebarOpen || isMobile) && (
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

                        {/* Child Menu Items */}
                        {hasChildren && isOpen && (sidebarOpen || isMobile) && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                  location.pathname === child.path
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {getUserName()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {getUserRole()}
                </div>
              </div>

              {/* Simple Avatar */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {getUserInitials()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
