# 📝 Blog Editor with Auto-Save | Full Stack Internship Assignment

🚀 [Live Demo](https://blog-editor-sandy.vercel.app/) • 💻 [Source Code](https://github.com/Sudiptacoding/Blog-Editor)

---

## 📌 Overview

This is a full-stack blog editor application built as part of an internship assignment. It allows users to **write**, **edit**, **save drafts**, and **publish blogs**. The project includes an **auto-save draft feature** with debouncing logic and provides clear separation between **drafts and published blogs**.

---

## ✨ Features

- 🧠 **Auto-save Drafts**
  - Every 30 seconds
  - After 5 seconds of typing inactivity (debounced)
- 📝 **Rich Blog Editor**
  - Title, content, and optional comma-separated tags
- 💾 Save as Draft
- 🚀 Publish Blog
- 🔄 Edit & Update existing blogs
- 📚 List of all blogs (Published and Drafts separately)
- ✅ Visual auto-save notification (toast message)

---

## 🛠️ Tech Stack

### Frontend:
- **React.js** (with Hooks & functional components)
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Toastify** for auto-save notifications

### Backend:
- **Node.js** with **Express.js**
- **MongoDB** (with Mongoose ODM)

---

## 🧩 System Architecture

```text
[ User (Browser) ]
        |
        v
[ Frontend (React.js) ]
        |
  REST API Calls (HTTP)
        |
        v
[ Backend (Express.js Server) ]
        |
        v
[ Database (MongoDB) ]
