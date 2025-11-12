import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/images/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth(); // ambil loading juga dari AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // reset error

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setErrorMessage("Email atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-header">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 object-contain drop-shadow-md"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          BALAI BESAR POM DI PADANG
        </h2>
        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          Masukkan email dan password untuk masuk ke akun Anda.
        </p>

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-5 text-sm border border-red-300">
            <AlertCircle className="w-4 h-4" />
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="username"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
