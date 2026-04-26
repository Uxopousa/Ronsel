# Ronsel

> A personal productivity web application focused on tasks, habits, goals, and planning.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Validation | Zod |
| API Docs | Swagger / OpenAPI |

## Features (MVP)

- **Authentication** — Register, login, JWT-based session
- **Tasks** — CRUD, priorities, due dates, categories, filters
- **Habits** — CRUD, daily logs, streaks, monthly calendar
- **Goals** — CRUD, task-based auto progress tracking
- **Dashboard** — Today view, weekly view, active goals
- **Categories** — Custom categories with colors for tasks and habits

## Documentation (Español)

All project documentation is in `/docs` (in Spanish).

| Document | Description |
|---|---|
| [Visión](./docs/01-vision.md) | Project vision and value proposition |
| [Objetivos](./docs/02-objetivos.md) | Product objectives |
| [Alcance](./docs/03-alcance.md) | Scope (in/out) |
| [Funcionalidades](./docs/04-funcionalidades.md) | Feature catalog |
| [MVP](./docs/05-mvp.md) | Minimum Viable Product definition |
| [Backlog](./docs/06-backlog.md) | Product backlog |
| [Requisitos Funcionales](./docs/07-requisitos-funcionales.md) | Functional requirements |
| [Requisitos No Funcionales](./docs/08-requisitos-no-funcionales.md) | Non-functional requirements |
| [Casos de Uso](./docs/09-casos-de-uso.md) | Use cases |
| [Arquitectura](./docs/10-arquitectura.md) | Proposed architecture |
| [Modelo de Datos](./docs/11-modelo-de-datos.md) | Data model (ER) |
| [Roadmap](./docs/12-roadmap.md) | Development roadmap |
| [Criterios de Aceptación](./docs/13-criterios-de-aceptacion.md) | Acceptance criteria |
| [Decisiones Técnicas](./docs/14-decisiones-tecnicas.md) | Technical decisions (ADRs) |

## Getting Started (Local Development)

### Prerequisites

- **Node.js** >= 20
- **Docker** >= 24 (with Docker Compose v2)
- **npm** >= 10

### Step-by-step setup

#### 1. Clone the repository

```bash
git clone <repo-url> ronsel
cd ronsel
```

#### 2. Start PostgreSQL with Docker

```bash
docker compose up -d
```

This starts PostgreSQL 16 on port 5432 with:
- User: `postgres`
- Password: `postgres`
- Database: `ronsel`
- Persistent volume: `ronsel_pg_data`

PostgreSQL is ready when the health check passes (usually 5-10 seconds).

#### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

The default `.env` connects to `localhost:5432` with the credentials above. No changes needed.

#### 4. Install backend dependencies

```bash
npm install
```

#### 5. Run database setup (migrate + seed)

```bash
npm run db:setup
```

This applies all Prisma migrations and seeds the database with demo data.

#### 6. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

The default configuration proxies API requests to the Vite dev server. No changes needed.

#### 7. Install frontend dependencies

```bash
npm install
```

#### 8. Start the backend

```bash
cd ../backend
npm run dev
```

The server starts at [http://localhost:4000](http://localhost:4000).

#### 9. Start the frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

#### 10. Log in

Use the demo account:

- **Email:** `demo@ronsel.app`
- **Password:** `password123`

Or create a new account from the login page.

### Verify everything works

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API Docs (Swagger):** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
- **Prisma Studio (DB browser):** `cd backend && npm run db:studio`

### Stop PostgreSQL

```bash
docker compose down
```

To also delete the database volume (WARNING: destroys all data):

```bash
docker compose down -v
```

## Project Structure

```
ronsel/
├── docker-compose.yml  PostgreSQL container configuration
├── frontend/           React + Vite + Tailwind
│   └── src/
│       ├── components/  UI, layout, shared modals
│       ├── pages/       Dashboard, Tasks, Habits, Goals, Login, Register
│       ├── services/    API client modules (axios)
│       ├── context/     AuthContext (JWT state)
│       ├── App.jsx      Route configuration
│       └── main.jsx     Entry point
├── backend/            Express + Prisma + JWT
│   └── src/
│       ├── routes/      Endpoint definitions
│       ├── controllers/ Request handlers
│       ├── services/    Business logic (streaks, progress, etc.)
│       ├── middleware/   Auth (JWT), validation (Zod), error handler
│       ├── validators/  Zod schemas
│       └── app.js       Express configuration
├── docs/               Product and architecture documentation
└── README.md
```

## Available Scripts

### Docker

| Script | Description |
|---|---|
| `docker compose up -d` | Start PostgreSQL container |
| `docker compose down` | Stop PostgreSQL container |
| `docker compose down -v` | Stop and delete database volume |

### Backend (`backend/`)

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm start` | Start production server |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:reset` | Reset database (drop all tables + re-migrate + re-seed) |
| `npm run db:studio` | Open Prisma Studio (DB browser) |
| `npm run db:setup` | Run migrations + seed (one command) |
| `npm run prisma:generate` | Regenerate Prisma client |

### Frontend (`frontend/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user profile |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks (with filters) |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | List habits (with today status) |
| GET | `/api/habits/:id` | Get habit by ID |
| GET | `/api/habits/:id/calendar` | Get monthly calendar |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| POST | `/api/habits/:id/toggle` | Toggle today's completion |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/goals` | List goals (with progress) |
| GET | `/api/goals/:id` | Get goal with tasks |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard data (today, week, goals) |

## License

MIT © Uxo Pousa
