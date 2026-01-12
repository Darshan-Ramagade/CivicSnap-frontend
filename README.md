# 🏙️ CivicSnap

> **An AI-powered civic engagement platform that helps citizens report, track, and prioritize city issues using image-based intelligence.**
> Built with **React, Node.js, MongoDB, and HuggingFace AI** to make cities smarter and governance more responsive.

![Node](https://img.shields.io/badge/node-v18+-green.svg)
![React](https://img.shields.io/badge/react-v18+-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 🌟 Why AI Civic Issue Mapper?

Traditional complaint systems are slow, manual, and inefficient. **AI Civic Issue Mapper** modernizes civic reporting by using **computer vision and automation** to classify issues, assign priority, and provide real-time visibility to both citizens and administrators.

✔ Faster issue identification
✔ Transparent tracking
✔ Data-driven prioritization
✔ Community participation

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence

* Automatic issue detection from images
* Smart categorization (potholes, garbage, lights, water leaks, etc.)
* AI-based severity assignment (Minor / Moderate / Critical)

### 🗺️ Citizen Dashboard

* View all reported issues on a single dashboard
* Filter by category, severity, and resolution status
* Upvote issues to increase priority

### 🔐 Admin Control Panel

* Secure admin authentication
* Update issue status (Reported → In Progress → Resolved)
* Remove duplicate or invalid reports
* Monitor platform-wide analytics

### 📊 Real-Time Insights

* Total reported issues
* Resolution rate
* Category-wise distribution

### 🎨 Modern UX

* Clean, responsive UI
* Smooth animations
* Mobile-friendly design

---

## 🛠️ Tech Stack

### Frontend

* **React 18** (Vite)
* React Router
* Axios
* Custom modern CSS

### Backend

* **Node.js + Express**
* MongoDB + Mongoose
* JWT Authentication
* HuggingFace (Vision Transformer)
* ImgBB (Image Hosting)
* bcryptjs

---

## 🤖 AI Classification

The system uses **HuggingFace Vision Transformer (ViT)** models to analyze uploaded images and classify them into civic issue categories:

* 🕳️ Potholes
* 🗑️ Garbage / Litter
* 💡 Broken Street Lights
* 🚰 Water Leakage
* 🎨 Graffiti
* ❓ Other

Each report also receives an **automatic severity score** to help authorities prioritize action.

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js v18+
* MongoDB Atlas (Free Tier)
* ImgBB API Key

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
node scripts/createAdmin.js
npm run dev
```

Backend runs at: **[http://localhost:5000](http://localhost:5000)**

---

### 🎨 Frontend Setup

```bash
cd civic-issue-mapper
npm install
npm run dev
```

Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
IMGBB_API_KEY=your_imgbb_key
JWT_SECRET=your_jwt_secret
```

---

## 👤 Default Admin Credentials

```
Email: admin@civicmapper.com
Password: admin123
```

⚠️ **Change credentials before deploying to production**

---

## 🧭 How It Works

1. User uploads an image of a civic issue
2. AI analyzes and classifies the image
3. Severity level is assigned automatically
4. Issue is stored and displayed on dashboard
5. Citizens can upvote for higher priority
6. Admin reviews and updates resolution status

---

## 📁 Project Structure

```
civic-issue-mapper/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   └── App.jsx
```

---

## 🔐 Security Highlights

* JWT-based authentication
* Password hashing with bcrypt
* Role-based access (User / Admin)
* Protected admin routes
* Input validation & sanitization

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 👨‍💻 Author

**Darshan Ramagade**
GitHub: [@Darshan-Ramagade](https://github.com/Darshan-Ramagade)

---

## 🙏 Acknowledgments

* HuggingFace – AI Models
* MongoDB Atlas – Database
* ImgBB – Image Hosting

---

### ❤️ Built to make cities cleaner, smarter, and more responsive

⭐ *Star this repository if you like the idea!*
