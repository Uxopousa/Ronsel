# Ronsel

> A personal productivity app for daily planning — tasks, habits, goals, and a clean calendar. Built with React, Express, and PostgreSQL.

<br>

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Ronsel Dashboard" width="800" />
</p>

---

## Table of Contents

- [What is Ronsel](#what-is-ronsel)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API](#api)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [License](#license)

## What is Ronsel

Ronsel helps you organize daily work across four interconnected modules:

- **Tasks** — what you need to do, when, and with what priority
- **Habits** — what you want to track daily or weekly, with streaks
- **Goals** — long-term objectives broken into tasks, with automatic progress
- **Dashboard** — a single view of today: pending tasks, habits, and a multi-view calendar

Everything is scoped to a single user. There are no teams, no sharing, no notifications — just you and your plan.

The name comes from the Galician word for *wake* (the trail left by a ship), reflecting the idea that small daily actions leave a visible path forward.

## Features

- [x] **Dashboard** — Today's tasks and habits at a glance. Multi-view calendar (3-day, week, month) with priority coloring and habit overlays. Active goals with live progress bars. Click-to-complete on tasks and habits. Summary cards with completion state.
- [x] **Tasks** — Full CRUD with priorities, due dates, and categories. List and calendar views. Search, quick filters (today, week, overdue), and advanced filters by status, priority, category, and goal.
- [x] **Habits** — Daily and weekly habits. One-click daily toggle. Weekly dot indicators with real completion data. Monthly calendar heatmap. Streak tracking (current and longest).
- [x] **Goals** — Objectives with start/target dates. Task-based progress calculation (same formula in backend and frontend). Expand/collapse with inline task management. Visual celebration at 100% completion.
- [x] **Categories** — Custom colored labels for tasks and habits. Preset color palette.
- [x] **Dark mode** — System-aware (`prefers-color-scheme`) with manual toggle. Design tokens for consistent theming. Persisted preference.
- [x] **Global search** — `Ctrl+K` / `⌘K` to search across tasks, habits, goals, and categories.
- [x] **Day detail modal** — Click any calendar day to see tasks and habits in a focused modal with backdrop blur.

## Screenshots

> Replace these placeholders with actual screenshots.

| Screen | Placeholder |
|--------|-------------|
| Dashboard (light) | `docs/screenshots/dashboard-light.png` |
| Dashboard (dark) | `docs/screenshots/dashboard-dark.png` |
| Tasks list | `docs/screenshots/tasks.png` |
| Tasks calendar | `docs/screenshots/tasks-calendar.png` |
| Habits with stats | `docs/screenshots/habits.png` |
| Goals with progress | `docs/screenshots/goals.png` |
| Day detail modal | `docs/screenshots/day-modal.png` |
| Global search | `docs/screenshots/search.png` |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4 |
| **Backend** | Node.js, Express 4 |
| **Database** | PostgreSQL 16 (via Docker) |
| **ORM** | Prisma 6 |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | Zod (backend schemas) |
| **API docs** | Swagger / OpenAPI 3.0 |
| **Icons** | Lucide React |

## Architecture

```
┌─────────────┐     HTTP/REST      ┌─────────────┐     Prisma      ┌─────────────┐
│   React     │ ────────────────── │   Express   │ ────────────── │ PostgreSQL  │
│   (Vite)    │    /api/*          │   (Node)    │                │    (Docker) │
│  :5173      │                    │   :4000     │                │    :5432    │
└─────────────┘                    └─────────────┘                └─────────────┘
     │                                    │
     │  Tailwind CSS                      │  JWT Auth
     │  Lucide Icons                      │  Zod Validation
     │  React Router                      │  Swagger Docs
     │  Axios                             │  Helmet + CORS
     └────────── Design tokens ───────────┘
                (light / dark)
```

**Backend layers:**

```
routes/  →  controllers/  →  services/  →  Prisma  →  PostgreSQL
    │                           │
    ├── validate.middleware     ├── ApiError
    └── auth.middleware         └── password.js / jwt.js
```

**Frontend structure:**

```
pages/  →  components/  →  services/  →  Axios  →  /api
   │            │
   ├── AuthContext          ├── ThemeContext
   └── ToastProvider        └── layout/
```

## Quick Start

```bash
# 1. Clone and start PostgreSQL
git clone <repo-url> ronsel && cd ronsel
docker compose up -d

# 2. Set up backend
cd backend
cp .env.example .env
npm install
npm run db:setup

# 3. Set up frontend
cd ../frontend
cp .env.example .env
npm install

# 4. Run (two terminals)
# Terminal 1 — backend
cd backend && npm run dev     # → http://localhost:4000

# Terminal 2 — frontend
cd frontend && npm run dev    # → http://localhost:5173

# 5. Login with demo account
# Email: demo@ronsel.app
# Password: password123
```

**Prerequisites:** Node.js ≥ 20, Docker ≥ 24, npm ≥ 10.

## Detailed Setup

### PostgreSQL (Docker)

```bash
docker compose up -d
```

Creates a PostgreSQL 16 container on port `5432` with:
- **User:** `postgres`
- **Password:** `postgres`
- **Database:** `ronsel`
- **Volume:** `ronsel_pg_data` (persists data across restarts)

Wait ~10 seconds for the health check to pass before running migrations.

### Backend

```bash
cd backend

# Environment variables (defaults work for local dev)
cp .env.example .env

# Install and set up database
npm install
npm run db:setup          # runs migrations + seeds demo data
```

The API starts at `http://localhost:4000`. Swagger docs at `/api-docs`.

Key environment variables (`backend/.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/ronsel` | PostgreSQL connection |
| `JWT_SECRET` | `change-me-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | Token expiration |
| `PORT` | `4000` | Server port |
| `FRONTEND_URL` | `http://localhost:5173` | CORS origin |

### Frontend

```bash
cd frontend

cp .env.example .env
npm install
npm run dev               # starts Vite dev server at :5173
```

The Vite dev server proxies `/api` requests to `http://localhost:4000`. No CORS issues in development.

## Available Scripts

### Backend (`backend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with `--watch` (hot reload) |
| `npm start` | Start production server |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:reset` | Drop all tables, re-migrate, re-seed |
| `npm run db:studio` | Open Prisma Studio (DB browser) |
| `npm run db:setup` | Migrate + seed in one command |

### Frontend (`frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |

### Docker

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL (data preserved) |
| `docker compose down -v` | Stop and delete database volume |

## Project Structure

```
ronsel/
├── docker-compose.yml              # PostgreSQL container
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Data model (6 models)
│   │   ├── seed.js                 # Demo data
│   │   └── migrations/             # Prisma migrations
│   └── src/
│       ├── routes/                 # Express route definitions
│       ├── controllers/            # Request handlers
│       ├── services/               # Business logic
│       ├── middleware/             # Auth, validation, errors
│       ├── validators/             # Zod schemas
│       ├── utils/                  # JWT, bcrypt, ApiError
│       └── docs/                   # Swagger setup
├── frontend/
│   └── src/
│       ├── pages/                  # Dashboard, Tasks, Habits, Goals, Login, Register
│       ├── components/
│       │   ├── layout/             # Layout, ProtectedRoute
│       │   ├── shared/             # TaskModal, HabitModal, GoalModal, CategoryModal
│       │   └── ui/                 # Toast, SearchPalette, BrandLogo, ThemeToggle
│       ├── services/               # API client modules (axios)
│       ├── context/                # AuthContext, ThemeContext
│       ├── App.jsx                 # Route definitions
│       ├── index.css               # Design system + Tailwind layers
│       └── main.jsx                # Entry point
├── docs/                           # Product documentation (14 docs, Spanish)
└── README.md
```

## API

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user profile |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (supports `status`, `priority`, `categoryId`, `goalId`, `dueDateFrom`, `dueDateTo`, `sortBy`, `sortOrder`) |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | List habits (includes today's completion status) |
| GET | `/api/habits/:id` | Get habit by ID |
| GET | `/api/habits/:id/calendar` | Get monthly completion calendar (`?year=&month=`) |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| POST | `/api/habits/:id/toggle` | Toggle today's completion |

### Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | List goals with task-based progress |
| GET | `/api/goals/:id` | Get goal with its tasks |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Aggregated data: today's tasks, pending habits, active goals (with progress), weekly calendar |

Full interactive API documentation available at `http://localhost:4000/api-docs` when the backend is running.

## Documentation

All product and architecture documentation is in `/docs` (in Spanish):

| Document | Content |
|----------|---------|
| [Visión](./docs/01-vision.md) | Project vision and value proposition |
| [Objetivos](./docs/02-objetivos.md) | Product objectives |
| [Alcance](./docs/03-alcance.md) | Scope definition |
| [Funcionalidades](./docs/04-funcionalidades.md) | Feature catalog |
| [MVP](./docs/05-mvp.md) | MVP definition |
| [Backlog](./docs/06-backlog.md) | Product backlog |
| [Requisitos Funcionales](./docs/07-requisitos-funcionales.md) | Functional requirements |
| [Requisitos No Funcionales](./docs/08-requisitos-no-funcionales.md) | Non-functional requirements |
| [Casos de Uso](./docs/09-casos-de-uso.md) | Use cases |
| [Arquitectura](./docs/10-arquitectura.md) | Proposed architecture |
| [Modelo de Datos](./docs/11-modelo-de-datos.md) | Data model (ER diagram) |
| [Roadmap](./docs/12-roadmap.md) | Development roadmap |
| [Criterios de Aceptación](./docs/13-criterios-de-aceptacion.md) | Acceptance criteria |
| [Decisiones Técnicas](./docs/14-decisiones-tecnicas.md) | Technical decisions (ADRs) |

## Roadmap

- [x] Tasks with categories, priorities, and calendar view
- [x] Habits with daily/weekly frequency, streaks, and monthly calendar
- [x] Goals with task-based progress tracking
- [x] Dashboard with multi-view calendar and interactive widgets
- [x] Dark mode with system preference detection
- [x] Global search (`Ctrl+K` / `⌘K`)
- [x] Subtle animations and micro-interactions
- [ ] Internationalization (multi-language support)
- [ ] Drag-and-drop task reordering
- [ ] Task dependency linking
- [ ] Habit flexible recurrence (specific days, monthly)
- [ ] Data export (JSON, CSV)
- [ ] PWA support (offline mode)
- [ ] End-to-end tests

## License

MIT © Uxío Pousa
