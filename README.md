# 💼 Employee Task Management System

> **A modern project and task management platform for teams and businesses.**

The Employee Task Management System is a full-stack MERN application that helps organizations manage employees, projects, and tasks from a centralized dashboard. Employers can assign work, collaborate through project-specific chats, monitor progress, and manage company settings—all in one place.

---

# 🚀 Features

## 👥 Employee Management

* Add new employees
* View employee directory
* Manage employee profiles
* Track assigned work

## 📊 Dashboard

* Company overview
* Project statistics
* Employee insights
* Task progress summary

## 📁 Project Management

* Create projects
* Edit project details
* Assign employees to projects
* Monitor project progress

## ✅ Task Management

* Create tasks
* Assign tasks to employees
* Update task status
* Track completion progress
* Task-wise file uploads

## 💬 Real-Time Collaboration

* Project-specific chat rooms
* Task-specific discussions
* Instant messaging using Socket.IO
* Real-time collaboration between team members

## 📂 File Uploads

* Upload task documents
* Share files within tasks
* Access uploaded resources anytime

## ⚙️ Company Settings

* Update company name
* Change company logo
* Manage organization details
* Customize workspace settings

---

# 🛠 Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT Authentication

### Real-Time

* Socket.IO

### File Storage

* Cloudinary 

### Deployment

* Frontend: Railway
* Backend: Railway

---

# 📂 Project Structure

```text
Employee-Task-Management/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── services/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── uploads/
│
└── README.md
```

---

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/employee-task-management.git
```

### Install Dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run Development Server

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

# 🌟 Key Highlights

* Complete MERN Stack Application
* Employee & Project Management
* Task Assignment System
* Real-Time Project & Task Chats
* File Upload Support
* Secure JWT Authentication
* Responsive Dashboard
* Modular REST API Architecture

---

# 🚀 Future Improvements

* Email Notifications
* Calendar Integration
* Team Roles & Permissions
* Time Tracking
* Activity Logs
* Kanban Board
* Gantt Chart
* Analytics & Reports
* Mobile Application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

Licensed under the MIT License.

---

# 👨‍💻 Author

**Rohit Maurya**

If you found this project useful, don't forget to leave a ⭐ on the repository.
