import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch {
      alert("Signup failed. Try a different username.");
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">Signup</h1>
      <form onSubmit={handleSignup} className="blog-form">
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
        <button type="submit">Signup</button>
      </form>
      <p style={{ textAlign: "center" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#0984e3" }}>
          Login
        </a>
      </p>
    </div>
  );
}
    