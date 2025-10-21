import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }}>
      <h2 style={{ color: "#0984e3" }}> Blog</h2>
      {username ? (
        <div>
          <span style={{ marginRight: "10px" }}>Hi, {username}</span>
          <button onClick={logout} className="cancel-btn">Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate("/login")} className="edit-btn">
          Login
        </button>
      )}
    </nav>
  );
}
