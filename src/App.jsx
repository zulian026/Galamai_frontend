import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import HomePage from "./pages/Homepage";
import ProfilPage from "./pages/ProfilPage";
import ServicePage from "./pages/ServicePage";
import BiayaUji from "./pages/layanan/BiayaUji";
import Pengaduan from "./pages/layanan/Pengaduan";
import WhistleBlowing from "./pages/layanan/WhistleBlowing";
import Pertanyaan from "./pages/layanan/Pertanyaan";
import FAQPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import NewsPage from "./pages/Berita/NewsPage";
import ArticlePage from "./pages/Berita/Article";
import NotFound from "./pages/NotFound";

// Chat Widget
import ChatWidget from "./components/ChatWidget";
import Users from "./pages/Dashboard/Users/Users";
import AplikasiDashboard from "./pages/Dashboard/Konten/Layanan_Aplikasi/AplikasiDashboard";
import LayananPage from "./pages/Dashboard/Layanan/LayananPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* Publik */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/layanan" element={<ServicePage />} />
            <Route path="/layanan/biaya-uji" element={<BiayaUji />} />
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route
              path="/dashboard/konten/Layanan_Aplikasi"
              element={<AplikasiDashboard />}
            />
            <Route path="/dashboard/Layanan" element={<LayananPage />} />
            {/* kalau ada halaman lain tambahin disini */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* === Bubble Chat selalu muncul === */}
        <ChatWidget />
      </Router>
    </AuthProvider>
  );
}
