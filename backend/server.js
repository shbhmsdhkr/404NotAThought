require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// import dotenv from "dotenv";
// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "supersecretjwtkey"; 


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    category: String,
    author: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);



app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});





app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid username" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, username });
});


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};



app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});


app.post("/api/posts", authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  const post = new Post({
    title,
    content,
    category: category || "General",
    author: req.user.username,
  });
  await post.save();
  res.json(post);
});


app.put("/api/posts/:id", authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  const post = await Post.findById(req.params.id);
  if (post.author !== req.user.username)
    return res.status(403).json({ message: "Not your post" });

  post.title = title;
  post.content = content;
  post.category = category;
  await post.save();
  res.json(post);
});


app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author !== req.user.username)
    return res.status(403).json({ message: "Not your post" });

  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});


app.listen(5000, () => console.log(" Backend running on http://localhost:5000"));

