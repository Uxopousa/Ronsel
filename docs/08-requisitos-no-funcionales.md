# Requisitos No Funcionales

## Rendimiento

| ID | Nombre | Descripción |
|---|---|---|
| RNF1 | Tiempo de carga | El tiempo de carga inicial del frontend (First Contentful Paint) será inferior a 2 segundos en conexiones de banda ancha. |
| RNF2 | Respuesta API | El tiempo de respuesta de la API (p95) será inferior a 500 ms para operaciones CRUD estándar. |
| RNF3 | Paginación | Las listas (tareas, hábitos) se paginarán con un máximo de 50 elementos por página. |
| RNF4 | Consultas eficientes | Las consultas a base de datos se optimizarán con índices en los campos de filtrado y ordenación. |

## Seguridad

| ID | Nombre | Descripción |
|---|---|---|
| RNF5 | Contraseñas | Las contraseñas se almacenarán hasheadas con bcrypt (cost factor ≥ 10). |
| RNF6 | JWT | Los tokens JWT tendrán una expiración máxima de 24 horas. |
| RNF7 | HTTPS | Toda la comunicación será sobre HTTPS en producción. |
| RNF8 | Headers de seguridad | Se utilizará Helmet para establecer headers de seguridad HTTP. |
| RNF9 | CORS | Se configurará CORS para permitir solo el origen del frontend. |
| RNF10 | Validación | Todos los inputs de usuario se validarán con Zod tanto en frontend como en backend. |
| RNF11 | SQL Injection | Se usará Prisma ORM (query parameterized) para prevenir SQL injection. |

## Disponibilidad y escalabilidad

| ID | Nombre | Descripción |
|---|---|---|
| RNF12 | Disponibilidad | La aplicación tendrá una disponibilidad objetivo del 99.5% (excluyendo mantenimiento programado). |
| RNF13 | Escalabilidad | La API será stateless para permitir escalado horizontal. |
| RNF14 | Backup | La base de datos tendrá backups automáticos diarios (gestionado por Neon). |

## Mantenibilidad

| ID | Nombre | Descripción |
|---|---|---|
| RNF15 | Código limpio | El código seguirá principios SOLID y convenciones de estilo consistentes (ESLint + Prettier). |
| RNF16 | Commits semánticos | Se usará Conventional Commits para mantener un historial claro. |
| RNF17 | Documentación API | La API estará documentada con OpenAPI 3.0 (Swagger). |
| RNF18 | Variables de entorno | Toda la configuración sensible estará en variables de entorno (dotenv). |

## Usabilidad

| ID | Nombre | Descripción |
|---|---|---|
| RNF19 | Responsive | La interfaz será totalmente responsive (mobile-first) usando CSS Grid/Flexbox. |
| RNF20 | Navegación | La navegación principal tendrá no más de 5 elementos. |
| RNF21 | Feedback visual | Cada acción del usuario tendrá feedback visual inmediato (loading, éxito, error). |
| RNF22 | Accesibilidad | Se seguirán pautas básicas de accesibilidad WAI-ARIA (roles, etiquetas, contraste). |

## Tecnología

| ID | Nombre | Descripción |
|---|---|---|
| RNF23 | Frontend | React 18+ con Vite como bundler. |
| RNF24 | Backend | Node.js 20+ con Express.js. |
| RNF25 | Base de datos | PostgreSQL 15+ en Neon. |
| RNF26 | ORM | Prisma para modelado y consultas. |
| RNF27 | Testing | Vitest + React Testing Library para tests unitarios y de componentes. |

## Despliegue

| ID | Nombre | Descripción |
|---|---|---|
| RNF28 | Frontend | Despliegue en Vercel con builds automáticos desde rama main. |
| RNF29 | Backend | Despliegue en Railway con builds desde rama main. |
| RNF30 | Base de datos | Neon PostgreSQL con conexión segura (SSL). |
