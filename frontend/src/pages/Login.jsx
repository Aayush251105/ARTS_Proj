import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" | "signup"

  // ── Login state ──────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Signup state ─────────────────────────────────────────────
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // ── Login handler ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });

      const data = await res.text();

      if (data.startsWith("SUCCESS")) {
        const parts = data.split(":");
        localStorage.setItem("userId",   parts[1]);
        localStorage.setItem("role",     parts[2]);
        localStorage.setItem("username", parts[3]);
        window.location.href = parts[2] === "ADMIN" ? "/admin" : "/";
      } else {
        setLoginError(data || "Invalid email or password.");
      }
    } catch {
      setLoginError("Could not connect to server. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Signup handler ────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setSignupLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupForm.username,
          email:    signupForm.email,
          password: signupForm.password,
          role:     "PASSENGER",
        }),
      });

      const data = await res.text();

      if (data === "SUCCESS") {
        setSignupSuccess("Account created! Switching to login…");
        setTimeout(() => {
          setTab("login");
          setSignupSuccess("");
        }, 1500);
      } else {
        setSignupError(data || "Signup failed. Please try again.");
      }
    } catch {
      setSignupError("Could not connect to server. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-title">✈ ARTS</div>
          <div className="auth-brand-sub">Airline Reservation &amp; Ticketing System</div>
        </div>

        {/* Toggle */}
        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setLoginError(""); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setSignupError(""); setSignupSuccess(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* ── LOGIN FORM ─────────────────────────────────────── */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin}>
            {loginError && <div className="auth-error">{loginError}</div>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loginLoading}>
              {loginLoading ? "Logging in…" : "Login"}
            </button>

            <div className="auth-footer">
              Don&apos;t have an account?{" "}
              <a onClick={() => setTab("signup")}>Sign Up</a>
            </div>
          </form>
        )}

        {/* ── SIGNUP FORM ────────────────────────────────────── */}
        {tab === "signup" && (
          <form className="auth-form" onSubmit={handleSignup}>
            {signupError   && <div className="auth-error">{signupError}</div>}
            {signupSuccess && <div className="auth-success">{signupSuccess}</div>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                className="auth-input"
                type="text"
                placeholder="John Doe"
                value={signupForm.username}
                onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={signupLoading}>
              {signupLoading ? "Creating account…" : "Create Account"}
            </button>

            <div className="auth-footer">
              Already have an account?{" "}
              <a onClick={() => setTab("login")}>Login</a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;