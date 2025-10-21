import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/");
    } catch {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">Login</h1>
      <form onSubmit={handleLogin} className="blog-form">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "#0984e3" }}>
          Signup
        </a>
      </p>
    </div>
  );
}
