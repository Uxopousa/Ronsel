# Ronsel

> A personal productivity web application focused on tasks, habits, goals, and planning.

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Validation | Zod |
| API Docs | Swagger / OpenAPI |
| Deploy | Vercel (FE) · Railway (BE) · Neon (DB) |

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

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env       # Configure DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev     # Create database tables
npm run dev                # Start at http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                # Start at http://localhost:5173
```

### API Documentation

Once the backend is running, visit [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

## Project Structure

```
ronsel/
├── frontend/          React + Vite + Tailwind
│   └── src/
│       ├── components/  UI, layout, shared
│       ├── pages/       Dashboard, Tasks, Habits, Goals
│       ├── services/    API client modules
│       ├── context/     AuthContext
│       ├── App.jsx
│       └── main.jsx
├── backend/           Express + Prisma + JWT
│   └── src/
│       ├── routes/      Endpoint definitions
│       ├── controllers/ Request handlers
│       ├── services/    Business logic
│       ├── middleware/   Auth, validation, errors
│       ├── validators/  Zod schemas
│       └── app.js
├── docs/              Product and architecture documentation
└── README.md
```

## Features (MVP)

- **Authentication** — Register, login, JWT-based session
- **Tasks** — CRUD, priorities, due dates, categories, filters
- **Habits** — CRUD, daily logs, streaks, monthly calendar
- **Goals** — CRUD, milestones, progress tracking
- **Dashboard** — Today view, weekly view, active goals summary
- **Categories** — Custom categories with colors for tasks and habits

## License

MIT © Uxo Pousa
