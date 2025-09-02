import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // Add loading state

  // Ambil user dari API
  const fetchUser = async (authToken) => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        // If token is invalid/expired, clear it
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("fetchUser error:", error);
      // Clear invalid token
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function that handles email/password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data);
        return false;
      }

      // Set token and user data
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setLoading(false);
  };

  // Function to set auth token directly (for existing tokens)
  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchUser(newToken);
  };

  // Jalan saat pertama kali render
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
