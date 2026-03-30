import { useState } from "react";
import "../styles/signup.css"; // reuse same styles
// Handelling submit 
  import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handelling submit 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.text();

      if (data.startsWith("SUCCESS")) {
        const parts = data.split(":");
        const userId = parts[1];
        const role = parts[2];
        const username = parts[3]; // <--- This is the new part from Java

        // store temporarily
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username); // <--- Save it here!

        window.location.href = "/"; // force refresh
        // redirect based on role
        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        alert(data);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" style={{marginBottom:"5px"}}>Login</button>
        <hr />
        <p style={{ textAlign: "center", fontSize: "14px" , marginTop:"5px" , backgroundColor:"transparent" }}>
            Don’t have an account? <a href="/signup" style={{backgroundColor:"transparent"}}>Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;