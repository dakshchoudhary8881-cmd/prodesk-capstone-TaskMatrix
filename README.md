<div align="center">

# ◈ TaskMatrix

### Enterprise Agile Project Management Platform

**A modern project management platform for teams to plan, organize, track, and deliver work efficiently.**

<br>

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge)

<br>

**Prodesk IT · Summer Engineering Internship 2026 · Capstone Project**

**Designated Track: Backend Architecture**

</div>

---

# 🌐 Live Product

<div align="center">

### TaskMatrix is being developed as a production-oriented full-stack application.

<br>

<a href="YOUR_LIVE_URL">

<img src="https://img.shields.io/badge/🚀%20OPEN%20TASKMATRIX-LIVE%20APPLICATION-4F46E5?style=for-the-badge&labelColor=111827" alt="Open TaskMatrix">

</a>

<br><br>

**[ ENTER TASKMATRIX → ](YOUR_LIVE_URL)**

</div>

---

# 📋 Project Information

| Item | Details |
|---|---|
| **Project Name** | TaskMatrix |
| **Project Type** | Enterprise Agile Project Management Platform |
| **Internship** | Prodesk IT Summer Engineering Internship 2026 |
| **Phase** | Capstone |
| **Designated Track** | Backend Architecture |
| **Development Model** | Full-Stack MERN Application |
| **Database** | MongoDB Atlas |
| **UI/UX Tool** | Figma |
| **Architecture Tool** | Draw.io |

---

# 📖 Product Overview

TaskMatrix is an Agile Project Management platform designed to help software teams manage their complete project workflow from a centralized workspace.

The platform allows teams to create workspaces, organize projects, create and assign tasks, manage work through Kanban boards, collaborate with team members, and monitor project progress.

The project is being designed with a scalable architecture so that the application can evolve from an MVP into a production-oriented enterprise platform.

---

# 🎯 Problem Statement

Software teams often use multiple disconnected tools for project planning, task tracking, team collaboration, and progress monitoring.

This can result in:

- Scattered project information
- Poor visibility of tasks
- Difficult team coordination
- Missed deadlines
- Inefficient workflows
- Limited project progress visibility

TaskMatrix aims to solve these problems by bringing project management and collaboration into one centralized platform.

---

# 💡 Product Goals

The primary goals of TaskMatrix are:

- Provide centralized project and task management.
- Simplify Agile workflow management.
- Enable team collaboration.
- Provide visual Kanban-based task tracking.
- Provide project progress insights.
- Build a scalable backend architecture.
- Implement secure authentication and authorization.
- Create a responsive and professional SaaS interface.

---

# ✨ Prioritized Core Features

The features are divided according to the capstone priority structure.

## 🔴 P0 — Mandatory MVP

These features form the minimum functional product.

| Priority | Feature | Description |
|---|---|---|
| P0 | 🔐 Authentication | User registration, login, logout, and session management |
| P0 | 🏢 Workspace Management | Create and manage team workspaces |
| P0 | 📁 Project Management | Create, view, update, and delete projects |
| P0 | ✅ Task Management | Create, update, assign, and delete tasks |
| P0 | 📋 Kanban Board | Manage tasks through workflow columns |
| P0 | 👥 Team Management | Manage workspace members and roles |
| P0 | 📊 Dashboard | Display project and task overview |

---

## 🟡 P1 — Priority Features

These features demonstrate additional architectural capability.

| Priority | Feature | Description |
|---|---|---|
| P1 | 💬 Comments | Task-level collaboration |
| P1 | 🔔 Notifications | Task and project activity notifications |
| P1 | 📅 Calendar | Deadlines and scheduled activities |
| P1 | 🔎 Search | Search projects and tasks |
| P1 | 🎯 Filters | Filter and sort project/task data |
| P1 | 📈 Reports | Project and productivity analytics |
| P1 | ⚙️ Settings | Account and workspace configuration |

---

## 🔵 P2 — Stretch Goals

These features are planned as optimization and advanced functionality.

| Priority | Feature | Description |
|---|---|---|
| P2 | ⚡ Real-Time Updates | Live project and task updates |
| P2 | 🤖 AI Assistance | AI-powered project and task assistance |
| P2 | 📧 Email Notifications | Automated notifications |
| P2 | 📎 File Attachments | Task and project file management |
| P2 | 📊 Advanced Analytics | Detailed productivity insights |
| P2 | 🔗 Integrations | Integration with external services |

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | Frontend application |
| TypeScript | Type-safe development |
| Vite | Development and build tooling |
| Tailwind CSS | UI styling |
| React Router | Application routing |
| Zustand | Global state management |
| React Hook Form | Form management |
| Zod | Form validation |
| Axios | API communication |
| DND Kit | Kanban drag-and-drop |
| Recharts | Analytics and charts |
| Framer Motion | UI animations |
| Lucide React | Icons |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | MongoDB data modeling |
| bcrypt | Password hashing |
| HTTP-only Cookies | Authentication |

## Development & Design

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Repository management |
| Figma | UI/UX wireframes |
| Draw.io | Architecture diagrams |
| Postman / Thunder Client | API testing |
| Vercel | Deployment |

---

# 🎨 UI/UX Design

The UI/UX design was created before implementation as required by the capstone planning phase.

### Core Viewports

The minimum required three core viewports are:

1. **Authentication Screen**
2. **Main Dashboard**
3. **Kanban / Task Management View**

Additional screens have also been designed to provide a complete product experience:

- Projects
- Task Details
- Calendar
- Team Management
- Reports
- Notifications
- Profile
- Settings

### Figma Design

🎨 **[View the TaskMatrix Figma Design →](YOUR_FIGMA_URL)**

---

# 🏗️ System Architecture

TaskMatrix follows a layered architecture designed to separate UI, state management, business logic, data access, and API communication.

```text
┌─────────────────────┐
│     React UI        │
│ Pages / Components  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Zustand Store    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Service Layer     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Repository Layer    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Axios Client     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Express REST API  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    MongoDB Atlas    │
└─────────────────────┘
```

This architecture allows the frontend and backend to remain modular and independently maintainable.

---

# 🗄️ Database Architecture

TaskMatrix will use MongoDB Atlas as the primary database.

### Planned MongoDB Collections

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

### Relationship Overview

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

The complete MongoDB ER diagram is available below:

![TaskMatrix ER Diagram](docs/diagrams/er-diagram.png)

---

# 🧠 Frontend State Tree

The frontend global state is planned around the major application domains.

```text
TaskMatrix
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

### State Management

**Zustand** will be used for global client-side state management.

The planned data flow is:

```text
Component
    ↓
Zustand
    ↓
Service
    ↓
Repository
    ↓
API Client
```

### State Tree Diagram

![TaskMatrix State Tree](docs/diagrams/state-tree.png)

---

# 🔌 Planned API Endpoints

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get authenticated user |

## Workspaces

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/:id` | Get workspace |
| PATCH | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |

## Projects

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

## Tasks

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update task status |

---

# 🔐 Authentication & Security Plan

TaskMatrix will use secure HTTP-only authentication cookies.

```text
User Login
    ↓
POST /api/auth/login
    ↓
Backend Authentication
    ↓
HTTP-only Cookie
    ↓
Authenticated Requests
    ↓
Protected API Routes
```

Security principles:

- HTTP-only authentication cookies
- Password hashing
- Protected routes
- Authorization checks
- Request validation
- Centralized error handling
- No passwords stored in frontend storage
- No JWT stored in localStorage
- No sensitive backend information exposed to clients

---

# 📋 Kanban Workflow

The primary task workflow is:

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

Tasks will support:

- Priority
- Assignee
- Due date
- Labels
- Checklist
- Comments
- Activity history

---

# 📈 Capstone Development Roadmap

| Phase | Deliverable | Priority | Status |
|---|---|---|---|
| Sprint 13 | Product Planning & PRD | P0 | ✅ |
| Sprint 13 | Figma Wireframes | P1 | ✅ |
| Sprint 13 | ER Diagram | P2 | 🚧 |
| Sprint 13 | State Tree | P2 | 🚧 |
| Sprint 13 | API Planning | P2 | 🚧 |
| Sprint 14 | Authentication & Workspace | P0 | 📅 |
| Sprint 15 | Projects, Tasks & Kanban | P0 | 📅 |
| Sprint 16 | Collaboration & Optimization | P1/P2 | 📅 |

---

# 📁 Planned Repository Structure

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
│   └── validators/
│
├── docs/
│   ├── diagrams/
│   │   ├── er-diagram.png
│   │   └── state-tree.png
│   │
│   └── images/
│
├── README.md
└── LICENSE
```

---

# 📸 UI Preview

The final UI designs will be documented here after the Figma refinement phase.

### Authentication

![TaskMatrix Login](docs/images/login.png)

### Dashboard

![TaskMatrix Dashboard](docs/images/dashboard.png)

### Kanban Board

![TaskMatrix Kanban](docs/images/kanban.png)

---

# 📦 Sprint 13 Deliverables

This repository contains the planning and architecture deliverables required for Sprint 13:

- [x] Project Selection — TaskMatrix
- [x] Public GitHub Repository
- [x] Product Requirements Document
- [x] Designated Track — Backend Architecture
- [x] Technology Stack Definition
- [x] Prioritized Feature Planning
- [x] UI/UX Wireframes
- [x] Figma Design
- [ ] ER Diagram
- [ ] Frontend State Tree Diagram
- [ ] Mock API Endpoint Documentation
- [ ] Live Website
- [ ] 2–3 Minute Demonstration Video

---

# 🎥 Sprint Demonstration

A short demonstration video explaining the planning, UI/UX design, architecture, and project roadmap will be provided here.

▶️ **[Watch the Sprint 13 Demo →](YOUR_YOUTUBE_URL)**

---

# 🌐 Submission Links

| Deliverable | Link |
|---|---|
| 📂 GitHub Repository | `YOUR_GITHUB_URL` |
| 🌐 Live Website | `YOUR_LIVE_URL` |
| 🎨 Figma Design | `YOUR_FIGMA_URL` |
| 🎥 Demo Video | `YOUR_YOUTUBE_URL` |

---

# 👨‍💻 Author

<div align="center">

### Daksh Choudhary

**B.Tech — Artificial Intelligence & Machine Learning**

Haridwar University

**Prodesk IT Summer Engineering Internship 2026**

**Backend Architecture Track**

[GitHub](YOUR_GITHUB_PROFILE) · [LinkedIn](YOUR_LINKEDIN_PROFILE)

</div>

---

<div align="center">

### ◈ TaskMatrix

**Plan · Organize · Execute · Deliver**

Built as a Prodesk IT Capstone Project.

</div>
