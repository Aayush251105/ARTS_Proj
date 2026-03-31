import { useState } from "react";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.status === "SUCCESS") {
        // Store JWT token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // Redirect based on role
        if (data.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "Login failed");
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

        <button type="submit" style={{marginBottom:"5px"}}>Login</button>
        <hr />
        <p style={{ textAlign: "center", fontSize: "14px" , marginTop:"5px" , backgroundColor:"transparent" }}>
            Don't have an account? <a href="/signup" style={{backgroundColor:"transparent"}}>Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;