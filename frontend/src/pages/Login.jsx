import { useState } from "react";
import "../styles/signup.css"; // reuse same styles

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login data:", form);

    // API call (we connect later)
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