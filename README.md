<div align="center">

# ◈ TASKMATRIX

### Enterprise Agile Project Management Platform

**Plan · Organize · Execute · Deliver**

A full-stack project management platform designed for modern software teams to manage projects, tasks, workflows, collaboration, and productivity from one centralized workspace.

<br>

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=111827)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square)](https://zustand.docs.pmnd.rs/)

<br>

**Prodesk IT · Summer Engineering Internship 2026 · Capstone**

**Designated Track:** Backend Architecture

</div>

---

<div align="center">

# 🌐 LIVE PRODUCT

### Experience TaskMatrix

<a href="YOUR_LIVE_URL">

<img src="https://img.shields.io/badge/🚀%20OPEN%20TASKMATRIX-LIVE%20APPLICATION-4F46E5?style=for-the-badge&labelColor=111827" alt="Open TaskMatrix" />

</a>

<br><br>

**Explore the complete TaskMatrix experience — projects, tasks, Kanban workflows, dashboards, and team collaboration.**

<br>

👉 **[ENTER TASKMATRIX →](YOUR_LIVE_URL)**

</div>

---

---

## 01 — PROJECT SIGNAL

| Signal | Details |
|---|---|
| **Product** | TaskMatrix |
| **Category** | Agile Project Management |
| **Architecture** | Layered Full-Stack Architecture |
| **Frontend** | React + TypeScript |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **State** | Zustand |
| **Authentication** | HTTP-only Cookie |
| **Design** | Figma |
| **Deployment** | Vercel + Cloud Backend |
| **Status** | In Development |

---

# 02 — THE PRODUCT

## What is TaskMatrix?

TaskMatrix is a full-stack Agile Project Management platform built for teams that need a centralized place to plan projects, organize tasks, collaborate with members, and monitor progress.

The product combines a modern SaaS interface with a modular backend architecture designed for maintainability and future scalability.

The core workflow is:

```text
Workspace
    ↓
Project
    ↓
Tasks
    ↓
Kanban Workflow
    ↓
Collaboration
    ↓
Progress & Analytics
```

TaskMatrix is being developed as the **Capstone Project for the Prodesk IT Summer Engineering Internship 2026**.

---

# 03 — WHY TASKMATRIX?

Modern teams often spread their work across multiple disconnected tools.

This creates problems such as:

- Scattered project information
- Poor task visibility
- Difficult team coordination
- Missed deadlines
- Repetitive project tracking
- Limited visibility into productivity

TaskMatrix brings these workflows together into one platform.

### Product Goals

```text
Centralize work
       ↓
Improve visibility
       ↓
Simplify collaboration
       ↓
Track execution
       ↓
Measure progress
```

---

# 04 — PRODUCT MAP

```text
                         TASKMATRIX
                             │
             ┌───────────────┴───────────────┐
             │                               │
        WORKSPACE                         USER
             │                               │
       ┌─────┴─────┐                         │
       │           │                         │
   PROJECTS      MEMBERS                 PROFILE
       │
       ▼
     TASKS
       │
 ┌─────┼──────────┐
 │     │          │
 ▼     ▼          ▼
KANBAN COMMENTS  ACTIVITY
 │
 ▼
ANALYTICS
```

---

# 05 — CORE FEATURES

## P0 — MVP

The mandatory foundation of the platform.

| Feature | Purpose |
|---|---|
| 🔐 Authentication | Secure registration, login, logout and session restoration |
| 🏢 Workspaces | Create and manage team workspaces |
| 📁 Projects | Complete project management |
| ✅ Tasks | Create, update, assign and manage tasks |
| 📋 Kanban | Visual task workflow |
| 👥 Team | Manage workspace members and roles |
| 📊 Dashboard | Centralized project overview |

---

## P1 — Advanced

| Feature | Purpose |
|---|---|
| 💬 Comments | Task-level collaboration |
| 🔔 Notifications | Project and task updates |
| 📅 Calendar | Deadlines and scheduled work |
| 🔎 Search | Find projects and tasks |
| 🎯 Filters | Refine project and task views |
| 📈 Reports | Productivity and project analytics |
| ⚙️ Settings | Account and workspace configuration |

---

## P2 — Future

| Feature | Purpose |
|---|---|
| ⚡ Real-time Collaboration | Live updates between users |
| 🤖 AI Assistance | Intelligent task and project assistance |
| 📧 Email Notifications | Automated communication |
| 📎 Attachments | Project and task file management |
| 🔗 Integrations | External productivity tools |
| 📊 Advanced Analytics | Deeper team insights |

---

# 06 — TECHNOLOGY STACK

### Frontend

```text
React 19
TypeScript
Vite
Tailwind CSS
React Router
Zustand
React Hook Form
Zod
Axios
Recharts
DND Kit
Framer Motion
Lucide React
```

### Backend

```text
Node.js
Express.js
MongoDB Atlas
Mongoose
bcrypt
HTTP-only Cookies
REST API
```

### Engineering Tools

```text
Git
GitHub
Figma
Draw.io
Postman / Thunder Client
Vercel
```

---

# 07 — SYSTEM ARCHITECTURE

TaskMatrix follows a layered architecture so that UI components remain independent from backend implementation details.

```text
┌──────────────────────┐
│     React UI         │
│ Components / Pages   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Zustand Store     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Service Layer     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Repository Layer   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Axios Client      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Express REST API  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│     MongoDB Atlas    │
└──────────────────────┘
```

### Why this architecture?

The separation allows individual layers to evolve without tightly coupling the entire application.

For example:

```text
UI does not know MongoDB
        ↓
Store does not know database details
        ↓
Service handles business operations
        ↓
Repository handles data access
        ↓
API handles communication
```

---

# 08 — FRONTEND STATE

Global state is managed using Zustand.

```text
TaskMatrix State
│
├── Auth
│   ├── User
│   └── Session
│
├── Workspace
│   ├── Current Workspace
│   └── Members
│
├── Projects
│   ├── Projects
│   └── Filters
│
├── Tasks
│   ├── Tasks
│   ├── Selected Task
│   └── Kanban State
│
├── Notifications
│
└── Theme
```

The frontend follows:

```text
Component
    ↓
Zustand
    ↓
Service
    ↓
Repository
    ↓
Axios
```

---

# 09 — DATABASE MODEL

MongoDB Atlas is used as the persistent data layer.

### Core Collections

```text
Users
Workspaces
WorkspaceMembers
Projects
Tasks
Comments
Notifications
Activities
```

### Relationship Model

```text
User
 │
 └── Workspace
       │
       ├── Members
       │
       └── Projects
              │
              └── Tasks
                    ├── Comments
                    ├── Activities
                    └── Attachments
```

### ER Diagram

The complete database architecture is documented in:

```text
docs/diagrams/er-diagram.png
```

---

# 10 — API MAP

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |

## Workspaces

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/workspaces` | List |
| POST | `/api/workspaces` | Create |
| GET | `/api/workspaces/:id` | Details |
| PATCH | `/api/workspaces/:id` | Update |
| DELETE | `/api/workspaces/:id` | Delete |

## Projects

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/projects` | List |
| POST | `/api/projects` | Create |
| GET | `/api/projects/:id` | Details |
| PATCH | `/api/projects/:id` | Update |
| DELETE | `/api/projects/:id` | Delete |

## Tasks

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List |
| POST | `/api/tasks` | Create |
| GET | `/api/tasks/:id` | Details |
| PATCH | `/api/tasks/:id` | Update |
| DELETE | `/api/tasks/:id` | Delete |
| PATCH | `/api/tasks/:id/status` | Change status |

---

# 11 — AUTHENTICATION & SECURITY

TaskMatrix uses HTTP-only cookie-based authentication.

```text
Login
  ↓
Express Authentication
  ↓
Session Cookie
  ↓
Authenticated Request
  ↓
Protected API
```

### Security Principles

- HTTP-only authentication cookies
- Password hashing
- Protected routes
- Authorization checks
- Input validation
- Centralized error handling
- No JWT in localStorage
- No passwords stored in frontend state
- Sensitive server information is not exposed

---

# 12 — KANBAN ENGINE

The Kanban board is built around four workflow states:

```text
┌─────────┐
│  TODO   │
└────┬────┘
     ↓
┌─────────────┐
│ IN PROGRESS │
└──────┬──────┘
       ↓
┌─────────┐
│ REVIEW  │
└────┬────┘
     ↓
┌─────────┐
│  DONE   │
└─────────┘
```

### Drag & Drop

Task movement uses optimistic updates:

```text
User Drag
    ↓
Update UI Immediately
    ↓
PATCH /api/tasks/:id/status
    ↓
MongoDB
    ↓
Success
    │
    └── Keep New State

Failure
    ↓
Rollback
    ↓
Error Feedback
```

---

# 13 — UI / UX

TaskMatrix follows a custom modern SaaS design language.

### Design Principles

- Dark-first interface
- Strong visual hierarchy
- Consistent spacing
- Reusable components
- Responsive layouts
- Accessible interactions
- Clear feedback states
- Minimal visual clutter

### Main Screens

```text
Authentication
Dashboard
Projects
Kanban
Task Details
Calendar
Team
Reports
Notifications
Profile
Settings
```

### Figma

🎨 **[Open TaskMatrix Figma Design](YOUR_FIGMA_URL)**

---

# 14 — PROJECT STRUCTURE

```text
TaskMatrix/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── repositories/
│       ├── store/
│       ├── routes/
│       ├── types/
│       └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── utils/
│
├── docs/
│   ├── diagrams/
│   └── images/
│
├── README.md
└── LICENSE
```

---

# 15 — DEVELOPMENT ROADMAP

```text
SPRINT 13
Planning
Architecture
PRD
Figma
ER Diagram
State Tree
Frontend Prototype
        │
        ▼
SPRINT 14
Authentication
Workspaces
Real API Integration
        │
        ▼
SPRINT 15
Projects
Tasks
Kanban
Team Management
        │
        ▼
SPRINT 16
Comments
Notifications
Analytics
Testing
Deployment
```

### Current Progress

| Area | Status |
|---|---|
| Product Planning | ✅ Complete |
| UI/UX Design | ✅ Complete |
| Frontend Prototype | ✅ Complete |
| Backend Architecture | ✅ Complete |
| Authentication Integration | 🚧 In Progress |
| Workspace Integration | 🚧 In Progress |
| Project Integration | 🚧 In Progress |
| Task Integration | 📅 Planned |
| Final Deployment | 📅 Planned |

---

# 16 — RUN LOCALLY

### Requirements

- Node.js
- npm
- MongoDB Atlas
- Git

### Clone

```bash
git clone YOUR_GITHUB_URL
cd prodesk-capstone-taskmatrix
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

# 17 — ENVIRONMENT VARIABLES

### Client

Create:

```text
client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

Create:

```text
server/.env
```

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

> Never commit `.env` files or secrets to GitHub.

---

# 18 — TESTING

TaskMatrix is tested at both frontend and backend levels.

### Frontend

- Navigation
- Forms
- Validation
- CRUD interactions
- Search
- Filters
- Kanban drag & drop
- Loading states
- Empty states
- Error states
- Responsive behavior

### Backend

- Authentication
- Authorization
- CRUD APIs
- Validation
- Protected routes
- Error handling

### Persistence Verification

```text
Create / Update / Delete
          ↓
     Verify UI
          ↓
    Refresh Browser
          ↓
 Verify Persistent Data
          ↓
     Verify MongoDB
```

---

# 19 — DEPLOYMENT

### Frontend

```text
React + Vite
     ↓
   Vercel
```

### Backend

```text
Express API
     ↓
Cloud Hosting
     ↓
MongoDB Atlas
```

### Live Application

🌐 **[Launch TaskMatrix](YOUR_LIVE_URL)**

---

# 20 — DOCUMENTATION

### Architecture

```text
docs/diagrams/er-diagram.png
docs/diagrams/state-tree.png
```

### UI Screenshots

```text
docs/images/
├── login.png
├── dashboard.png
├── projects.png
├── kanban.png
└── task-details.png
```

---

# 21 — DEMO

A short 2–3 minute demonstration covering the product, architecture, UI, and core workflow:

▶️ **[Watch the TaskMatrix Demo](YOUR_YOUTUBE_URL)**

---

# 22 — FUTURE DIRECTION

TaskMatrix is designed to grow beyond basic project management.

Potential future capabilities include:

```text
Real-time Collaboration
        +
AI Assistance
        +
Advanced Analytics
        +
External Integrations
        +
Automated Notifications
```

The architecture is intentionally modular so these capabilities can be introduced without rebuilding the core system.

---

# 23 — AUTHOR

<div align="center">

## Daksh Choudhary

**B.Tech — Artificial Intelligence & Machine Learning**

Haridwar University

**Prodesk IT Summer Engineering Internship 2026**

Backend Architecture Track

[GitHub](YOUR_GITHUB_PROFILE) · [LinkedIn](YOUR_LINKEDIN_PROFILE)

</div>

---

# 24 — LICENSE

This project is licensed under the **MIT License**.

---

<div align="center">

### ◈ TASKMATRIX

**Plan · Organize · Execute · Deliver**

Built as a **Prodesk IT Capstone Project**

⭐ Star the repository if you find it interesting.

</div>
