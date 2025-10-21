import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [showLogin, setShowLogin] = useState(true);

  const categories = ["All", "Tech", "Lifestyle", "Travel", "General"];

  useEffect(() => {
    if (username) fetchPosts();
  }, [username]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", authForm);
      alert("Signup successful! Please login now.");
      setShowLogin(true);
    } catch (err) {
      alert("Signup failed. Username might already exist.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", authForm);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      setUsername(res.data.username);
      fetchPosts();
    } catch (err) {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
    setPosts([]);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category)
      return alert("Please fill all fields!");
    if (!username) return alert("Login first to publish posts");

    const token = localStorage.getItem("token");

    if (editingPost) {
      await axios.put(`${API_URL}/${editingPost._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingPost(null);
    } else {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({ title: "", content: "", category: "" });
    fetchPosts();
  };

  const deletePost = async (id, author) => {
    if (username !== author) return alert("Cannot delete others' posts");
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const startEdit = (post) => {
    if (username !== post.author) return alert("Cannot edit others' posts");
    setEditingPost(post);
    setForm({ title: post.title, content: post.content, category: post.category });
  };


  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  
  if (!username) {
    
    return (
      <div className="container">
        <h1 className="app-title"> Blog</h1>
        <form
          onSubmit={showLogin ? handleLogin : handleSignup}
          className="blog-form"
        >
          <input
            type="text"
            placeholder="Username"
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          <div className="form-buttons">
            <button type="submit">{showLogin ? "Login" : "Signup"}</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowLogin(!showLogin)}
            >
              Switch to {showLogin ? "Signup" : "Login"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  
  return (
    <div className="container">
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="app-title"> Blog</h1>
        <div>
          <span style={{ marginRight: "10px" }}>Hi, {username}</span>
          <button className="cancel-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Blog Form */}
      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          placeholder="Enter title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Write your blog content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.filter((cat) => cat !== "All").map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="form-buttons">
          <button type="submit">{editingPost ? "Update Post" : "Publish"}</button>
          {editingPost && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingPost(null);
                setForm({ title: "", content: "", category: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search + Filter */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-bar"
          placeholder=" Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Posts */}
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">No matching posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-card" key={post._id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p className="post-category">Category: {post.category}</p>
              <p style={{ fontSize: "0.8em", color: "#555" }}>
                Author: {post.author} | {new Date(post.createdAt).toLocaleString()}
              </p>
              {username === post.author && (
                <div className="card-buttons">
                  <button className="edit-btn" onClick={() => startEdit(post)}>Edit</button>
                  <button className="delete-btn" onClick={() => deletePost(post._id, post.author)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

