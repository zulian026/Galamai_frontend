import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />

          {/* Text */}
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-800">
              Memverifikasi akses...
            </h2>
            <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
