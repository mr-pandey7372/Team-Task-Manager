# Team Task Manager

A professional, full-stack MERN (MongoDB, Express, React, Node.js) application designed for strict, role-based project and task management. It features a modern, responsive UI built with Tailwind CSS, robust backend security, and a strict assignment workflow.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Distinct `Admin` and `Member` privileges.
- **Strict Assignment Constraints:**
  - **1 Member = 1 Project:** Members can only be assigned to a single project at a time.
  - **1 Active Task Per Member:** A member cannot be assigned a new task until their current task is marked as `Done`.
- **Dynamic Availability UI:** Admins only see "Available" members in dropdowns (hiding members who are already busy with active tasks or other projects).
- **Interactive Dashboard:** Visual analytics using Recharts to track project and task statuses.
- **Premium UI/UX:** React Hot Toast notifications, custom animated modals, and responsive mobile-first design.
- **Single-URL Deployment:** Configured as a monorepo so the Express backend automatically serves the compiled React frontend in production.

---

## 🔄 End-to-End Workflow

This application enforces a strict lifecycle to ensure accountability and clarity in team management.

### 1. Registration & Authentication
- Users register an account and select their role: **Admin** or **Member**.
- **Admins** have full read/write access to all projects, tasks, and analytics.
- **Members** have read-only access to their assigned projects and can only update the `status` of their specifically assigned tasks.

### 2. Project Creation (Admin)
- An Admin navigates to the **Projects** tab and clicks "New Project".
- The Admin selects team members from a dynamically filtered dropdown.
- **Constraint Check:** The dropdown *only* displays Members who are not currently assigned to any other project.

### 3. Task Assignment (Admin)
- The Admin navigates to the **Tasks** tab and clicks "New Task".
- The Admin selects a Project. The "Assign To" dropdown automatically populates with Members belonging to that specific project.
- **Constraint Check:** If a Member currently has a task with a status of `Todo` or `In Progress`, they are considered "Busy" and are hidden from the dropdown. 
- A mandatory **Due Date** must be set before the task is created.

### 4. Task Execution (Member)
- A Member logs in and goes to their Dashboard. They only see the specific project they belong to and the single task assigned to them.
- The Member clicks "View Details" on their task.
- As they work, they update the task status from `Todo` -> `In Progress` -> `Done`.

### 5. Re-Assignment Loop
- The exact moment the Member marks their task as `Done`, the system flags them as "Available".
- Their profile instantly reappears in the Admin's "Assign To" dropdown, ready to receive their next task in the project!

---

## 💻 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Recharts, React Router v6, Axios, React Hot Toast.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Security:** JWT (JSON Web Tokens) Authentication, bcryptjs password hashing, Express-Validator.

---

## 🚀 How to Run Locally

Because this is a MERN Stack app, you need to run both the frontend and backend servers simultaneously.

### Prerequisites
- Node.js installed
- A MongoDB URI (Local or Atlas)

### 1. Setup Environment Variables
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 2. Install Dependencies
Open a terminal at the root of the project and run:
```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Start the Application
Open two separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Your app will now be running at `http://localhost:5173`!

---

## 🌐 Deployment (Railway)

This project is pre-configured for a "Single-URL" deployment on platforms like Railway. The root `package.json` instructs the server to build the frontend and serve it directly from the Express backend.

1. Push your code to GitHub.
2. Create a new project on Railway and deploy from your GitHub repo.
3. Add your Environment Variables in the Railway dashboard (Make sure `NODE_ENV` is set to `production`).
4. Railway will automatically install dependencies, build the React frontend, start the Node server, and serve everything on a single domain!
