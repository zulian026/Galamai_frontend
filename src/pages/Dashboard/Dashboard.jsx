import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Status: {isAuthenticated ? "Logged in" : "Logged out"}</p>

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
