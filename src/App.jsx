import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// ✅ Import ToastProvider
import { ToastProvider } from "./contexts/ToastContext";
import { ConfirmModalProvider } from "./contexts/ConfirmModalContext";
import { ConfirmProvider } from "./contexts/ConfirmContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import HomePage from "./pages/Homepage";
import ProfilPage from "./pages/ProfilPage";
import ServicePage from "./pages/ServicePage";
import Pengaduan from "./pages/layanan/Pengaduan";
import WhistleBlowing from "./pages/layanan/WhistleBlowing";
import Pertanyaan from "./pages/layanan/Pertanyaan";
import FAQPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Auth/Login";
import NewsPage from "./pages/Berita/NewsPage";
import ArticlePage from "./pages/Berita/Article";
import NotFound from "./pages/NotFound";

import Users from "./pages/Dashboard/Users/Users";
import AplikasiDashboard from "./pages/Dashboard/Konten/Layanan_Aplikasi/AplikasiDashboard";
import LayananPage from "./pages/Dashboard/Layanan/LayananPage";
import NewsDetailPage from "./pages/Berita/NewsDetailView";
import BeritaEvent from "./pages/Dashboard/Konten/Berita/BeritaEvent";
import Artikel from "./pages/Dashboard/Konten/Artikel/Artikel";
import ArticleDetailPage from "./pages/Berita/ArticleDetailView";
import AdminProfilPage from "./pages/Dashboard/Konten/Profil/ProfilPage";
import ChartLayanan from "./pages/Dashboard/Konten/Chart_Layanan/ChartLayanan";
import Contact from "./pages/Dashboard/Kontak/Contact";
import PertanyaanPage from "./pages/Dashboard/Pertanyaan/PertanyaanPage";
import DashboardRoute from "./routes/DashboardRoute";
import DashboardAdminWhistle from "./pages/Dashboard/DashboardAdminWhistle";
import WhistleblowingAdmin from "./pages/Dashboard/Wb/WhistleblowingAdmin";
import KepalaBalaiDashboard from "./pages/Dashboard/Wb/KepalaBalaiDashboard";
import AdminPengaduanPage from "./pages/Dashboard/Pengaduan/AdminPengaduan";
// import FAQ from "./pages/Dashboard/Faq/FaqPage";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Router>
            <ConfirmModalProvider>
              <ScrollToTop />

              <Routes>
                {/* Publik */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profil" element={<ProfilPage />} />
                  <Route path="/layanan" element={<ServicePage />} />
                  <Route path="/layanan/pengaduan" element={<Pengaduan />} />
                  <Route
                    path="/layanan/whistle-blowing"
                    element={<WhistleBlowing />}
                  />
                  <Route path="/layanan/pertanyaan" element={<Pertanyaan />} />
                  <Route path="/berita/berita-event" element={<NewsPage />} />
                  <Route path="/berita/artikel" element={<ArticlePage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/kontak" element={<ContactPage />} />
                  <Route path="/berita" element={<NewsPage />} />
                  <Route path="/:type/:id" element={<NewsDetailPage />} />
                  <Route path="/artikel/:id" element={<ArticleDetailPage />} />
                </Route>

                {/* Auth */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* Dashboard (Protected) */}
                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardRoute />} />
                  <Route path="/dashboard/users" element={<Users />} />
                  <Route
                    path="/dashboard/konten/Layanan_Aplikasi"
                    element={<AplikasiDashboard />}
                  />
                  <Route path="/dashboard/Layanan" element={<LayananPage />} />
                  <Route path="/dashboard/Berita" element={<BeritaEvent />} />
                  <Route
                    path="/dashboard/konten/artikel"
                    element={<Artikel />}
                  />
                  <Route
                    path="/dashboard/profil"
                    element={<AdminProfilPage />}
                  />
                  <Route
                    path="/dashboard/chart-layanan"
                    element={<ChartLayanan />}
                  />
                  <Route path="/dashboard/kontak" element={<Contact />} />
                  <Route
                    path="/dashboard/pertanyaan"
                    element={<PertanyaanPage />}
                  />
                  <Route
                    path="/dashboard/whistle"
                    element={<WhistleblowingAdmin />}
                  />
                  <Route
                    path="/dashboard/Laporanwb"
                    element={<KepalaBalaiDashboard />}
                  />
                  <Route
                    path="/dashboard/pengaduan"
                    element={<AdminPengaduanPage />}
                  />
                  {/* <Route path="/dashboard/faq" element={<FAQ />} /> */}

                  {/* kalau ada halaman lain tambahin disini */}
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </ConfirmModalProvider>
          </Router>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
