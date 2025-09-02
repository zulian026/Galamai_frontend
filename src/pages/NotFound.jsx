import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white  px-4">
      {/* Judul */}
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-black ">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mt-2 text-slate-600  text-center max-w-md">
        Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>

      {/* Tombol Aksi */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Home size={18} /> Ke Beranda
        </Link>
      </div>
    </div>
  );
}
