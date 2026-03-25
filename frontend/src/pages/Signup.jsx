import { useState } from "react";
import "../styles/signup.css";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", form);

    // API call (we connect later)
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

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

        <button type="submit" style={{marginBottom:"5px"}}>Sign Up</button>
        <hr />
        <p style={{ textAlign: "center", fontSize: "14px" , marginTop:"5px" , backgroundColor:"transparent" }}>
            Already have an account? <a href="/login" style={{backgroundColor:"transparent"}}>Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;