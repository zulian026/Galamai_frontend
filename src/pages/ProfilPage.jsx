import React, { useState, useEffect } from "react";
import heroBg from "../assets/images/hero-bg.png";
import {
  Info,
  Target,
  ClipboardList,
  User,
  Users,
  HeartHandshake,
  Activity,
  MapPin,
  UserCircle,
  Lightbulb,
  Award,
  Scale,
  Handshake,
  BookOpen,
  Building,
  Phone,
  ChevronRight,
} from "lucide-react";

const tabs = [
  { id: "sejarah", label: "Sejarah", icon: Info },
  { id: "visi-misi", label: "Visi & Misi", icon: Target },
  { id: "tugas-fungsi", label: "Tugas Pokok & Fungsi", icon: ClipboardList },
  { id: "profil-kepala", label: "Profil Kepala BPOM di Padang", icon: User },
  { id: "struktur", label: "Struktur Organisasi", icon: Users },
  { id: "budaya", label: "Budaya Organisasi", icon: HeartHandshake },
  { id: "kegiatan", label: "Kegiatan", icon: Activity },
];

// Konten tiap tab dengan desain yang lebih menarik
const tabContent = {
  sejarah: (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Sejarah Balai POM di Padang
        </h2>
        <p className="text-gray-500 text-sm">
          Perjalanan dan Perkembangan Institusi
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            Balai POM di Padang didirikan sebagai bentuk komitmen pemerintah
            dalam mengawasi keamanan obat dan makanan di wilayah Sumatera Barat.
            Sejak awal berdirinya, institusi ini telah berperan strategis dalam
            menjaga kesehatan masyarakat.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Sebagai institusi yang berperan penting dalam menjaga kesehatan
            masyarakat, Balai POM terus berkembang mengikuti dinamika zaman dan
            kebutuhan pengawasan yang semakin kompleks. Dengan teknologi modern
            dan SDM yang kompeten, Balai POM di Padang siap menghadapi tantangan
            masa depan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-header/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-header" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Prestasi</h3>
            <p className="text-gray-600 text-sm">
              Berbagai penghargaan tingkat nasional
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-header/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-header" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Tim Profesional
            </h3>
            <p className="text-gray-600 text-sm">
              SDM berkompeten dan berpengalaman
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-header/10 rounded-lg flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-header" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Fasilitas Modern
            </h3>
            <p className="text-gray-600 text-sm">
              Laboratorium dan peralatan canggih
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  "visi-misi": (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Visi & Misi
        </h2>
        <p className="text-gray-500 text-sm">Arah dan Tujuan Organisasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visi */}
        <div className="bg-gradient-to-br from-header/5 to-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-header rounded-xl flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-header">Visi</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg font-medium">
            "Mewujudkan masyarakat yang terlindungi dari obat dan makanan
            berbahaya melalui sistem pengawasan yang efektif dan terpercaya."
          </p>
        </div>

        {/* Misi */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">Misi</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Melakukan pengawasan berkualitas terhadap produk obat dan makanan",
              "Meningkatkan kesadaran masyarakat tentang keamanan konsumsi",
              "Membangun sistem pengawasan yang terintegrasi dan efisien",
              "Memberikan pelayanan publik yang prima dan responsif",
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),
  "tugas-fungsi": (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Tugas Pokok & Fungsi
        </h2>
        <p className="text-gray-500 text-sm">Kewenangan dan Tanggung Jawab</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Menyelenggarakan pengawasan obat dan makanan di wilayah kerja sesuai
          dengan ketentuan peraturan perundang-undangan yang berlaku, termasuk
          pengujian, sertifikasi, dan penegakan hukum.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Scale,
              title: "Pengawasan",
              desc: "Monitoring produk obat dan makanan",
            },
            {
              icon: Award,
              title: "Sertifikasi",
              desc: "Penerbitan sertifikat dan izin",
            },
            {
              icon: BookOpen,
              title: "Pengujian",
              desc: "Analisis laboratorium berkualitas",
            },
            {
              icon: Handshake,
              title: "Penegakan Hukum",
              desc: "Tindakan terhadap pelanggaran",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-header/10 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-header" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  "profil-kepala": (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Profil Kepala BPOM di Padang
        </h2>
        <p className="text-gray-500 text-sm">Kepemimpinan dan Visi</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/3">
            <div className="w-48 h-48 bg-gradient-to-br from-header to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <UserCircle className="w-24 h-24 text-white" />
            </div>
          </div>
          <div className="lg:w-2/3 text-center lg:text-left">
            <p className="text-gray-700 leading-relaxed text-lg">
              Informasi mengenai profil dan track record kepala Balai POM di
              Padang dalam memimpin institusi pengawasan obat dan makanan dengan
              dedikasi tinggi dan komitmen untuk melayani masyarakat.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  struktur: (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Struktur Organisasi
        </h2>
        <p className="text-gray-500 text-sm">Hierarki dan Pembagian Kerja</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Struktur organisasi yang solid terdiri dari kepala balai, bidang
          pengawasan, bidang laboratorium, dan staf administrasi yang bekerja
          secara sinergis untuk mencapai tujuan organisasi.
        </p>

        <div className="space-y-4">
          {[
            {
              level: "Kepala Balai",
              desc: "Pimpinan tertinggi dan penanggung jawab",
            },
            {
              level: "Bidang Pengawasan",
              desc: "Monitoring dan inspeksi lapangan",
            },
            {
              level: "Bidang Laboratorium",
              desc: "Analisis dan pengujian sampel",
            },
            {
              level: "Staf Administrasi",
              desc: "Dukungan operasional dan administrasi",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-header/10 rounded-lg flex items-center justify-center">
                <span className="text-header font-bold">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{item.level}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  budaya: (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Budaya Organisasi
        </h2>
        <p className="text-gray-500 text-sm">Nilai-nilai dan Prinsip Kerja</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Budaya organisasi yang mengedepankan integritas, profesionalisme, dan
          pelayanan prima untuk mewujudkan masyarakat yang sehat dan
          terlindungi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: HeartHandshake,
              title: "Integritas",
              desc: "Jujur dan dapat dipercaya",
            },
            {
              icon: Award,
              title: "Profesionalisme",
              desc: "Kompeten dan berkualitas",
            },
            {
              icon: Users,
              title: "Pelayanan Prima",
              desc: "Mengutamakan kepentingan masyarakat",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-header/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-8 h-8 text-header" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  kegiatan: (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-header to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-header to-blue-600 bg-clip-text text-transparent mb-2">
          Kegiatan
        </h2>
        <p className="text-gray-500 text-sm">Program dan Aktivitas Rutin</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Berbagai kegiatan rutin dan program unggulan yang dilaksanakan untuk
          mendukung pengawasan obat dan makanan serta peningkatan kesadaran
          masyarakat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Activity,
              title: "Inspeksi Rutin",
              desc: "Pemeriksaan berkala fasilitas produksi dan distribusi",
            },
            {
              icon: BookOpen,
              title: "Sosialisasi",
              desc: "Edukasi masyarakat tentang keamanan produk",
            },
            {
              icon: Users,
              title: "Pelatihan",
              desc: "Capacity building untuk pelaku industri",
            },
            {
              icon: Scale,
              title: "Pengujian Sampel",
              desc: "Analisis laboratorium produk beredar",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-header/10 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-header" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("sejarah");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* HEADER ala HERO */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Profil Balai POM
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Balai Pengawas Obat dan Makanan di Padang
            </p>
          </div>
        </div>
      </section>

      {/* LAYOUT dengan SIDEBAR */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:sticky lg:top-24">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10  bg-header rounded-xl flex items-center justify-center mr-3">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Menu Profil</h3>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? " bg-header text-white shadow-lg shadow-header/25 transform scale-[1.02]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-header hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium leading-tight">
                          {tab.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          activeTab === tab.id
                            ? "rotate-90"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* KONTEN Area */}
          <div className="lg:w-3/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div
                className={`p-8 lg:p-12 transition-all duration-700 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
