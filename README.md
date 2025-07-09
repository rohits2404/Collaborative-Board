# 📋 👥 ✅ 🛠️  Taskflow: Real-Time Collaborative To-Do Board

A Web-based Collaborative To-Do Board Application where Multiple Users can log in, manage tasks, and see changes happen in real time.

[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://reactjs.org/)
[![CSS](https://img.shields.io/badge/CSS-3-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-white.svg?logo=socket.io)](https://socket.io/)

---

## 🚀 Live Demo

🔗 [Deployed Frontend](https://taskflow-three-theta.vercel.app/)  
🔗 [Deployed Backend](https://collaborative-board-9j5q.onrender.com)  
📹 [Demo Video (YouTube / Loom)]()

## 🧠 Tech Stack

**Frontend:**
| Tech | Role |
|------|------|
| [**React.js 19**](https://v6.vite.dev/) | React framework |
| [**JavaScript**](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Script Language |
| [**CSS**](https://developer.mozilla.org/en-US/docs/Web/CSS) | Custom CSS For Styling |
| [**React-Beautiful-DnD**](https://www.npmjs.com/package/react-beautiful-dnd) | Beautiful and accessible drag and drop for lists with React |
| [**Socket IO Client**](https://socket.io/docs/v4/) | Bidirectional and low-latency communication for every platform |

**Backend:**
| Tech | Role |
|------|------|
| [**JavaScript**](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Script Language |
| [**NodeJs**](https://nodejs.org/docs/latest/api/) | Backend Environment For Javascript |
| [**ExpressJs**](https://www.mongodb.com/) | Web Framework For NodeJs |
| [**MongoDB**](https://www.mongodb.com/) | Database |
| [**Socket IO**](https://socket.io/docs/v4/) | Bidirectional and low-latency communication for every platform |

## 🛠️ Setup & Installation

### 🧪 Prerequisites

- Node.js v18+
- MongoDB (Atlas or Local)
- Vite (optional, for frontend)
- Yarn or npm

### 📂 Backend Setup

### 1\. Clone the Repository

```bash
git clone https://github.com/rohits2404//Collaborative-Board.git
cd collaborative-board
```
### 2\. Backend

```bash
cd backend
npm install
```

🔐 Environment Variables
Create a .env file inside /backend:

```env
PORT=5000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=frontend_deployed_url
```

▶️ Start Backend Server
```bash
npm run dev
```

### 3\. Frontend

```bash
cd frontend
npm install
```

🔐 Environment Variables
Create a .env file inside /backend:

```env
VITE_API_URL=(backend_deployed_url)/api
VITE_SOCKET_URL=backend_deployed_url)
```

▶️ Start Frontend Server
```bash
npm run dev
```

## 📦 Features

### 👥 User Authentication
- Secure registration and login
- JWT-based token authentication
- Passwords hashed using bcrypt

### 🧱 Kanban Board
- 3 columns: **To Do**, **In Progress**, **Done**
- Drag and drop tasks between columns
- Real-time updates across all clients

### ⚡ Real-Time Sync
- Socket.IO used for syncing tasks instantly between users

### 📋 Task Management
- Add, update, delete, assign tasks
- Each task has title, description, status, assigned user, and priority

### 🧠 Smart Assign
- Assigns the task to the user with the fewest active tasks in real-time

### 🔄 Conflict Handling
- If two users edit the same task at the same time:
  - Conflict is detected
  - Both versions are shown
  - User decides whether to merge or overwrite

### 📝 Action Log
- Logs every action: create, update, assign, delete, move
- Displays the last 20 actions in a side panel
- Updates live as changes occur

### 🎨 UI & UX
- Fully custom CSS without frameworks
- Mobile responsive design
- Smooth drag-drop with animations
- Card flip animation for task details

---

---

🧠 Explanations for Smart Assign and Conflict Handling Logic

🔁 Smart Assign Logic
The Smart Assign feature ensures a fair distribution of active tasks among users by assigning a task to the user with the fewest non-completed tasks.

🧮 How It Works:
All users are fetched from the database.

All tasks with status other than Done are also fetched.

A task count is calculated for each user:

```js
const taskCounts = users.reduce((acc, user) => {
  acc[user._id] = tasks.filter(t => t.assignedTo.equals(user._id)).length;
  return acc;
}, {});
```
The user with the fewest tasks is selected using:

```js
const [userIdWithFewestTasks] = Object.entries(taskCounts).sort((a, b) => a[1] - b[1])[0];
```
The task is assigned to that user and saved.

✅ This logic ensures:

Balanced task assignment

Real-time updates via Socket.IO

Audit logging via logAction

⚔️ Conflict Handling Logic
The app detects if two users are trying to edit the same task concurrently and avoids silent overwrites.

🧪 How It Works:
When a task is edited, the previous state is captured:

```js
const previousState = { ...task._doc };
```
Updates are applied, and the new task state is saved.

The logAction function logs both previousState and newState to the database.

On the frontend, if a Socket.IO event or HTTP fetch reveals a mismatch (e.g., timestamps or field differences), the app prompts users to:

View both versions of the task.

Choose to:

Merge the content manually, or

Overwrite the other version.

💡 This prevents accidental data loss in collaborative sessions.
