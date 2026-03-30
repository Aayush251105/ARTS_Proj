import { useState } from "react";
import "../styles/signup.css"; 
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.text();
      if (data.startsWith("SUCCESS")) {
        const parts = data.split(":");
        localStorage.setItem("userId", parts[1]);
        localStorage.setItem("role", parts[2]);
        localStorage.setItem("username", parts[3]);
        window.location.href = parts[2] === "ADMIN" ? "/admin" : "/";
      } else {
        alert(data);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="auth-toggle">
          <button type="button" className="auth-tab active">Login</button>
          <button type="button" className="auth-tab" onClick={() => navigate('/signup')}>Signup</button>
        </div>

        <h2>Welcome Back</h2>

        <div style={{ background: 'transparent' }}>
            <label>Email Address</label>
            <input 
                type="email" 
                name="email" 
                placeholder="Enter Email Address" 
                onChange={handleChange} 
                required 
            />
        </div>

        <div style={{ background: 'transparent' }}>
            <label>Password</label>
            <input 
                type="password" 
                name="password" 
                placeholder="Enter Password" 
                onChange={handleChange} 
                required 
            />
        </div>

        <button type="submit">Login to Account</button>
        
        <p className="footer-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;