import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * AdminRoute — protects admin routes with server-side JWT validation.
 * 1. Reads token from localStorage
 * 2. Calls /api/auth/validate to verify token server-side
 * 3. If invalid or role !== "ADMIN", redirects to /login
 */
function AdminRoute({ children }) {
  const [authState, setAuthState] = useState("loading"); // loading | authorized | unauthorized

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthState("unauthorized");
      return;
    }

    // Validate token on the server
    fetch("http://localhost:8080/api/auth/validate", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.role === "ADMIN") {
          setAuthState("authorized");
        } else {
          // Token invalid or not admin — clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          setAuthState("unauthorized");
        }
      })
      .catch(() => {
        setAuthState("unauthorized");
      });
  }, []);

  if (authState === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#F9FAFB",
          fontFamily: "'Inter', sans-serif",
          color: "#6B7280",
          fontSize: "16px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <i
            className="fa-solid fa-shield-halved"
            style={{ fontSize: "32px", color: "#3B82F6", marginBottom: "12px", display: "block" }}
          ></i>
          Verifying admin access...
        </div>
      </div>
    );
  }

  if (authState === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
