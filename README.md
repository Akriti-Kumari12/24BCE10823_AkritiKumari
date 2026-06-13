# EchoBoard 📝

> A full-stack blog platform where writers share their stories, vlogs, and daily updates — built with the MERN stack.

![EchoBoard](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80)

---

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | JWT-based signup, login, logout |
| 📝 Posts | Create, edit, delete with cover image |
| 🌐 Visibility | Public or Private posts |
| 💬 Comments | Threaded comments with replies |
| ❤️ Likes | Like/unlike any post |
| 👤 Profile | Public profile with follower/following |
| 🛡️ Admin Panel | Full control over users, posts, comments |
| 🔍 Search | Full-text search + category filter |
| 📱 Responsive | Works perfectly on all screen sizes |

---

## 🛠 Tech Stack

**Frontend**
- React 19 + React Router v7
- Tailwind CSS v3
- Axios, React Hot Toast, React Icons
- Moment.js, React Helmet Async

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose 8
- JWT Authentication
- Multer (image uploads)
- bcryptjs + express-validator

---

## 📁 Project Structure

```
EchoBoard/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar, Footer, PostCard
│       ├── context/         # AuthContext (global auth state)
│       ├── pages/           # Home, Login, Register, Dashboard...
│       │   └── admin/       # AdminDashboard, Users, Posts, Comments
│       └── utils/           # Axios API instance
│
└── server/                  # Express backend
    ├── models/              # User, Post, Comment schemas
    ├── routes/              # auth, posts, comments, admin, users
    ├── middleware/          # JWT auth, Multer upload
    └── uploads/             # Uploaded images
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally

### 1. Clone the repo
```bash
git clone https://github.com/Akriti-Kumari322/EchoBoard.git
cd EchoBoard
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/echoboard
JWT_SECRET=echoboard_super_secret_jwt_key_2024
NODE_ENV=development
```

Seed the admin account:
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install --legacy-peer-deps
npm start
```

App runs at **http://localhost:3000**

---

## 🔑 Admin Credentials

```
Email:    admin@echoboard.com
Password: admin123
```

---

## 🔄 App Workflow

```
[ Guest ]
    │
    ├── Browse public posts (Home)
    ├── Search & filter by category
    └── Read full post + view author profile
          │
          └──► [ Sign Up / Login ]
                    │
                    ├── Create post (public or private)
                    ├── Upload cover image
                    ├── Add tags & category
                    ├── Edit / delete own posts
                    ├── Like posts
                    ├── Comment & reply on posts
                    ├── Follow other writers
                    └── Manage profile (avatar, bio)
                              │
                              └──► [ Admin Panel ] (admin only)
                                        │
                                        ├── Dashboard stats
                                        ├── Manage all users
                                        │     ├── Restrict / unrestrict
                                        │     ├── Promote to admin
                                        │     └── Delete user
                                        ├── Manage all posts
                                        │     └── Delete any post
                                        └── Manage all comments
                                              └── Delete any comment
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |

### Posts
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/posts` | Public |
| GET | `/api/posts/my` | Private |
| GET | `/api/posts/:id` | Public |
| POST | `/api/posts` | Private |
| PUT | `/api/posts/:id` | Private |
| DELETE | `/api/posts/:id` | Private |
| POST | `/api/posts/:id/like` | Private |

### Comments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/comments/:postId` | Public |
| POST | `/api/comments/:postId` | Private |
| DELETE | `/api/comments/:id` | Private |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |
| PUT | `/api/admin/users/:id/restrict` | Admin |
| PUT | `/api/admin/users/:id/promote` | Admin |
| GET | `/api/admin/posts` | Admin |
| DELETE | `/api/admin/posts/:id` | Admin |
| GET | `/api/admin/comments` | Admin |
| DELETE | `/api/admin/comments/:id` | Admin |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Home | Hero section + post grid with search & filters |
| Post Detail | Full post with comments & author card |
| Dashboard | User stats + post management |
| Admin Panel | Full control sidebar layout |

---

## 👩‍💻 Developer

**Akriti** — Full Stack Developer

Built with ❤️ using the MERN Stack

---

## 📄 License

MIT License © 2024 Akriti
