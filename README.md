# 📋 👥 ✅ 🛠️ Taskflow: Real-Time Collaborative To-Do Board

A web-based collaborative To-Do Board application where multiple users can log in, manage tasks, and see changes in real time—similar to a minimal Trello board with live sync and smart logic.

---

[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://reactjs.org/)
[![CSS](https://img.shields.io/badge/CSS-3-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-white.svg?logo=socket.io)](https://socket.io/)

---

## 🚀 Live Demo

🔗 [**Frontend Deployment**](https://taskflow-board.vercel.app/)  
🔗 [**Backend Deployment**](https://collaborative-board-9j5q.onrender.com)  
📹 [**Demo Video**](#) *(Coming soon)*

---

## 🧠 Tech Stack

### Frontend:

| Technology | Purpose |
|------------|---------|
| [React.js 19](https://react.dev/) | UI development |
| [JavaScript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Scripting |
| [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Styling |
| [React Beautiful DnD](https://www.npmjs.com/package/react-beautiful-dnd) | Smooth drag-and-drop UX |
| [Socket.IO Client](https://socket.io/docs/v4/) | Real-time communication |

### Backend:

| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | Web framework |
| [MongoDB + Mongoose](https://www.mongodb.com/) | NoSQL database |
| [Socket.IO](https://socket.io/) | Real-time server communication |
| [JWT + Bcrypt](https://jwt.io/) | Auth and password security |

---

## 🛠️ Setup & Installation

### 📦 Prerequisites

- Node.js v18+  
- MongoDB Atlas or Local DB  
- Yarn or npm  
- Vite (optional)

---

### ⚙️ Backend Setup

1. **Clone the Repository**

```bash
git clone https://github.com/rohits2404/Collaborative-Board.git
cd Collaborative-Board
````

2. **Install Dependencies**

```bash
cd backend
npm install
```

3. **Environment Variables**

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-frontend-url.com
```

4. **Run the Server**

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `/frontend`:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

Run the frontend:

```bash
npm run dev
```

---

## 📦 Features

### 👥 User Authentication

* Registration & login
* JWT token-based auth
* Passwords hashed with bcrypt

### 📋 Task Board (Kanban)

* Columns: **To Do**, **In Progress**, **Done**
* Drag and drop between columns
* Reassign tasks to any user

### ⚡ Real-Time Collaboration

* All task updates sync across clients live
* Built using Socket.IO

### 🧠 Smart Assign

* Assigns a task to the user with the fewest active tasks

### ⚔️ Conflict Handling

* Detects if two users edit the same task simultaneously
* Shows both versions with option to **merge** or **overwrite**

### 📝 Action Log

* Logs every task action (add/edit/delete/move)
* Shows last 20 actions with real-time updates

### 🎨 UI & UX

* 100% custom CSS
* Fully responsive layout
* Drag-and-drop with animation
* Card flip animation on task click

---

## 🧠 Logic Breakdown

### 🔁 Smart Assign Logic

Ensures fair task distribution by automatically assigning the task to the user with the **least number of active tasks** (not marked "Done").

#### 🧮 How It Works:

```js
const taskCounts = users.reduce((acc, user) => {
  acc[user._id] = tasks.filter(t => t.assignedTo.equals(user._id)).length;
  return acc;
}, {});

const [userIdWithFewestTasks] = Object.entries(taskCounts)
  .sort((a, b) => a[1] - b[1])[0];

task.assignedTo = mongoose.Types.ObjectId(userIdWithFewestTasks);
```

✅ **Benefits**:

* Balanced task load
* Real-time updates via Socket.IO
* Logs assignment for audit history

---

### ⚔️ Conflict Handling Logic

Prevents **silent overwrites** when multiple users edit the same task at the same time.

#### 🧪 How It Works:

```js
const previousState = { ...task._doc };
```

* `previousState` is saved before any update.
* `logAction` stores both `previousState` and new `task`.
* On the frontend:

  * If mismatch is detected (e.g., version conflict),
  * User sees a prompt to **merge** or **overwrite** the task.

💡 Ensures data consistency and user control.

---

## 📄 Documentation

* [Logic\_Document](./docs/Logic_Document.md) — Detailed explanation of Smart Assign & Conflict Handling

---
