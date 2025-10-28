# 📰 404NotAThought

## 💬 Description

A full-stack blog web application that handles creation, modification, and management of blog posts with structured and reverse chronological sorting

## 🚀 Features

#### 🧑‍💻 Authentication

- User Signup, Login, Logout
- Passwords securely hashed with bcrypt
- JWT authentication for secure API access

#### 📝 CRUD Functionality 
- Create, edit, and delete blog posts
- Each post has:
    - Title
    - Content
    - Category
    - Author
    - Timestamp
- Posts are displayed in reverse chronological order (latest first)

#### 🔍 Search & Filter
- Search posts by title or content
- Filter posts by category

#### 🎨 UI 
- Clean and minimal blog-style layout

## 🔧 Tech Stack
|Layer	|	Technology|
|-------|-------------|
|Frontend |	React (Vite), CSS
|Backend |	Node.js, Express.js
|Database |	MongoDB (Mongoose ODM)
|Authentication |	JSON Web Token (JWT), bcrypt|

## ⚙️ Setup
#### 1️⃣ Fork the repository

#### 2️⃣ Clone the repository 
`git clone https://github.com/<yourusername>/blog.git`
`cd blog`

#### 3️⃣ Setup .env
`
cd backend
`
`
cp env-example .env
`

#### 4️⃣ Setup Backend
```
npm install
```

```
npm run start
```

The backend runs at 👉 http://localhost:5000

#### 5️⃣ Setup Frontend

```
cd ../frontend
```

```
npm install
```

```
npm run dev
```

The frontend runs at 👉 http://localhost:5173

## 🧩 API Endpoints
#### 🔐 Authentication
|Method |	Endpoint |	Description|
|-------|------------|-------------|
|POST |	/api/signup |	Register new user|
|POST |	/api/login |	Login existing user|

#### 📝 Posts
|Method |	Endpoint |	Description|
|-------|------------|-------------|
|GET |	/api/posts |	Get all posts|
|POST |	/api/posts |	Create new post (JWT required)|
|PUT |	/api/posts/:id |	Edit a post (JWT required)|
|DELETE |	/api/posts/:id |	Delete a post (JWT required)|

## 🗂️ Folder Structure
```
blog/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── models/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── signup.jsx
│   │   ├── login.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── .env
│   └── vite.config.js
├── .gitignore
└── README.md
```
