Demo run video:
CLICK THIS:
https://github.com/user-attachments/assets/e0c5bcf4-f5fb-49f1-ada0-75925a3cf210

# HR Workflow Management Platform

A full-stack HR workflow automation platform built for a hackathon.

---

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend  | Node.js, Express         |
| Database | MongoDB (via Mongoose)   |
| Auth     | JWT (JSON Web Tokens)    |
| Charts   | Chart.js + react-chartjs-2 |

---

## Project Structure

```
hr-workflow-platform/
├── client/                  ← React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      ← AppLayout, Sidebar, Topbar
│   │   │   └── ui/          ← KpiCard, Badge, Modal, Toggle
│   │   ├── context/         ← AuthContext (global auth state)
│   │   ├── pages/           ← One file per page/section
│   │   ├── utils/           ← Axios API instance
│   │   ├── App.jsx          ← Routes
│   │   └── main.jsx         ← React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                  ← Express + MongoDB backend
│   ├── config/
│   │   └── seed.js          ← Demo data seeder
│   ├── controllers/         ← Business logic per resource
│   ├── middleware/          ← JWT auth middleware
│   ├── models/              ← Mongoose schemas
│   ├── routes/              ← Express route definitions
│   ├── index.js             ← Server entry point
│   ├── .env.example         ← Environment variable template
│   └── package.json
│
├── package.json             ← Root scripts (run both together)
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18 or later
- MongoDB running locally **or** a MongoDB Atlas connection string

---

### Step 1 — Clone / extract the project

Open VS Code, then open the `hr-workflow-platform` folder.

---

### Step 2 — Set up environment variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set your MongoDB URI:

```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/hr_workflow

# OR MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_workflow

JWT_SECRET=any_long_random_string_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### Step 3 — Install all dependencies

From the **root** folder, run:

```bash
npm run install:all
```

This installs packages for the root, server, and client in one command.

---

### Step 4 — Seed the database with demo data

```bash
node server/config/seed.js
```

This creates:
- Admin user: `admin@company.com` / `admin123`
- Employee user: `employee@company.com` / `emp123`
- 7 workflows, 4 rules, 12 audit log entries

---

### Step 5 — Run the project

From the **root** folder:

```bash
npm run dev
```

This starts both servers at the same time:
- **Frontend** → http://localhost:5173
- **Backend**  → http://localhost:5000

---

## Demo Credentials

| Role     | Email                    | Password  |
|----------|--------------------------|-----------|
| Admin    | admin@company.com        | admin123  |
| Employee | employee@company.com     | emp123    |

---

## Features

- **Login** — Role-based (Admin / Employee) with JWT authentication
- **Dashboard** — KPI cards, trend chart, status donut, activity timeline
- **Workflows** — Create new or pick from 6 pre-built templates
- **Rule Builder** — Custom rules or pick from 5 rule templates
- **Analytics** — 4 charts with role-specific data
- **Audit Logs** — Admin-only, filterable, fetched from MongoDB
- **Settings** — General, Notifications, Integrations, Security.



