# Arquitectura Propuesta

## Visión general

Ronsel sigue una arquitectura **SPA (Single Page Application)** con frontend React y backend REST API, desplegados de forma independiente.

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Cliente   │──────>│   Backend    │──────>│  PostgreSQL  │
│  React SPA  │<──────│  Express.js  │<──────│   (Neon)     │
│   (Vite)    │  JWT  │   (Railway)  │ Prisma│              │
└─────────────┘       └──────────────┘       └──────────────┘
       │                      │
       │                      │
  ┌────┴────┐           ┌─────┴─────┐
  │ Vercel  │           │  Swagger  │
  │  CDN    │           │  /api-docs│
  └─────────┘           └───────────┘
```

## Frontend (React + Vite)

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/           # Toast, indicadores
│   ├── layout/       # Layout, ProtectedRoute
│   └── shared/       # TaskModal, HabitModal, GoalModal, GoalDetail, etc.
├── pages/            # Páginas (Dashboard, Tasks, Habits, Goals, Login, Register)
├── services/         # Llamadas a la API (tasks.js, habits.js, goals.js, etc.)
├── context/          # AuthContext
├── App.jsx           # Configuración de rutas
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales (Tailwind)
```

### Principios del frontend

- **Componentes atómicos**: siguiendo diseño atómico (átomos → moléculas → organismos).
- **Custom hooks**: toda la lógica de estado y efectos vive en hooks.
- **Servicios**: toda comunicación con la API se centraliza en `/services`.
- **Estilos con Tailwind CSS**: utilidades atómicas, desarrollo rápido, bundle purgado en producción. No usar CSS Modules salvo casos excepcionales.
- **React Router v6** para navegación cliente.

## Backend (Express.js)

```
backend/
├── src/
│   ├── routes/          # Definición de rutas (tasks.routes.js, habits.routes.js)
│   ├── controllers/     # Controladores (lógica de request/response)
│   ├── services/        # Lógica de negocio
│   ├── middleware/       # auth.middleware.js, error.middleware.js, validate.middleware.js
│   ├── validators/      # Esquemas Zod (task.schema.js, habit.schema.js)
│   ├── utils/           # helpers (jwt.js, password.js, apiError.js)
│   ├── prisma/          # Cliente Prisma inicializado
│   ├── docs/            # Configuración Swagger
│   ├── app.js           # Configuración Express (middlewares globales)
│   └── server.js        # Punto de entrada
└── prisma/
    ├── schema.prisma    # Modelo de datos
    └── migrations/      # Migraciones
```

### Patrón backend

Se sigue una **arquitectura en capas simple**:

```
Route → Validator → Controller → Service → Prisma (DB)
   │                        │
   └─── Auth Middleware ─────┘
```

| Capa | Responsabilidad |
|---|---|
| **Routes** | Definir endpoints y conectar middleware + controller |
| **Middleware** | Autenticación JWT, validación Zod, manejo de errores |
| **Controllers** | Recibir request, llamar al servicio, devolver response |
| **Services** | Lógica de negocio, orquestación, cálculos (rachas, progreso) |
| **Prisma** | Acceso a base de datos |

### Flujo de una petición típica

```
1. Request → Express
2. Route matches → URL + method
3. Auth middleware → verifica JWT (excepto /auth/*)
4. Validation middleware → valida body/params con Zod
5. Controller → extrae datos, llama al servicio
6. Service → ejecuta lógica, consulta/escribe DB con Prisma
7. Controller → formatea respuesta
8. Response → JSON
9. Error middleware → captura errores no controlados
```

## Base de datos (PostgreSQL + Prisma)

Ver [Modelo de Datos](./11-modelo-de-datos.md) para el esquema detallado.

## Documentación API

Swagger/OpenAPI 3.0 se sirve en `/api-docs`. Cada controlador tendá decoradores JSDoc generando la spec automáticamente con `swagger-jsdoc`.

## Seguridad

- **JWT** en header `Authorization: Bearer <token>`
- **Helmet** para headers de seguridad
- **CORS** configurado sólo para el origen del frontend
- **bcrypt** (cost 12) para hasheo de contraseñas
- **Zod** para validación de entrada en backend
- **Prisma** evita SQL injection mediante query parameterized

## Despliegue

| Componente | Plataforma | Dominio ejemplo |
|---|---|---|
| Frontend | Vercel | ronsel.vercel.app |
| Backend | Railway | ronsel-api.railway.app |
| BD | Neon | ronsel.db.neon.tech |

## Decisiones arquitectónicas clave

| Decisión | Opción elegida | Alternativa descartada |
|---|---|---|
| Frontend framework | React | Vue, Svelte (más ecosistema, más librerías) |
| Bundler | Vite | CRA (Vite es más rápido, mejor DX) |
| Backend runtime | Node.js + Express | Fastify, Nest (simplicidad para MVP) |
| ORM | Prisma | Drizzle, TypeORM (mejor DX, tipos, migraciones) |
| Base de datos | PostgreSQL | SQLite, MySQL (escalabilidad, funciones avanzadas) |
| Autenticación | JWT (stateless) | Sesiones (stateless escala mejor sin Redis) |
| Validación | Zod | Joi, Yup (tipado, integración con TypeScript futuro) |
| API Docs | Swagger (swagger-jsdoc) | Postman, Redoc (estándar de facto) |
