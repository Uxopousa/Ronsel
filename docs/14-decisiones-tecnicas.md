# Decisiones Técnicas (ADRs)

## ADR-001: React + Vite para el frontend

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos un framework frontend moderno para construir una SPA responsive. Las opciones principales son React, Vue y Svelte. |
| **Decisión** | Usar React 18+ con Vite como bundler. |
| **Justificación** | React tiene el ecosistema más maduro, más librerías disponibles, y es el framework con el que el desarrollador tiene más experiencia. Vite ofrece HMR ultrarrápido, build optimizado con Rollup y mejor DX que CRA. |
| **Consecuencias** | Bundle size > alternativa con Svelte (asumible para MVP). Curva de aprendizaje plana para el desarrollador. |
| **Alternativas** | Vue (menos ecosistema), Svelte (menos librerías, menos experiencia del equipo), CRA (más lento, mantenimiento abandonado). |

---

## ADR-002: Express.js para el backend

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos un framework HTTP para Node.js que sea simple, extensible y adecuado para un MVP. |
| **Decisión** | Usar Express.js. |
| **Justificación** | Express es el framework HTTP más usado en Node.js, tiene la comunidad más grande, middleware maduro, y mínima abstracción. Para un MVP no necesitamos la opinión de NestJS ni la velocidad de Fastify. La simplicidad de Express acelera el desarrollo inicial. |
| **Consecuencias** | Rendimiento inferior a Fastify en benchmarks (no relevante para el volumen esperado). Responsabilidad del desarrollador de mantener estructura limpia (sin opinión fuerte del framework). |
| **Alternativas** | Fastify (más rápido, menos middleware), NestJS (más estructura, más overhead para MVP). |

---

## ADR-003: PostgreSQL + Prisma ORM

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos una base de datos relacional con un ORM que acelere el desarrollo y prevenga SQL injection. |
| **Decisión** | Usar PostgreSQL (Neon) con Prisma ORM. |
| **Justificación** | PostgreSQL es el motor relacional más avanzado y escalable. Prisma ofrece type-safety, generación automática de cliente, migraciones declarativas y una DX excelente con autocompletado. Neon proporciona PostgreSQL serverless con backup automático y conexión SSL. |
| **Consecuencias** | Prisma añade ~20ms de overhead por consulta vs SQL puro (asumible). Migraciones gestionadas por Prisma (no SQL manual). Dependencia del schema de Prisma como fuente de verdad. |
| **Alternativas** | MySQL (menos funciones avanzadas), SQLite (no escala), Drizzle ORM (menos maduro, menos ecosistema), TypeORM (peor DX). |

---

## ADR-004: JWT stateless para autenticación

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos un mecanismo de autenticación para la API REST. |
| **Decisión** | Usar JWT (JSON Web Tokens) con expiración de 24h. |
| **Justificación** | JWT es stateless — no requiere almacenamiento en servidor (sesiones), lo que facilita el escalado horizontal. La expiración de 24h balancea seguridad y UX. bcrypt (cost 12) para hasheo de contraseñas. |
| **Consecuencias** | No podemos invalidar tokens individuales sin una blacklist (innecesario para MVP). Si el token se compromete, es válido hasta que expire. La renovación de token requerirá lógica adicional en el futuro (refresh tokens). |
| **Alternativas** | Sesiones con cookie (requiere Redis o almacenamiento compartido para escalar), Passport.js (más complejo para necesidades simples). |

---

## ADR-005: Zod para validación

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos validar datos de entrada tanto en frontend como en backend. |
| **Decisión** | Usar Zod para validación de esquemas. |
| **Justificación** | Zod ofrece type inference, lo que permite derivar tipos TypeScript de los esquemas de validación. Es más ligero que Joi y tiene mejor integración con TypeScript. Los esquemas se pueden compartir entre frontend y backend como un paquete común. |
| **Consecuencias** | Si no usamos TypeScript en el frontend, perdemos parte del beneficio de type inference. Aun así, la API de Zod es superior a alternativas. |
| **Alternativas** | Joi (más verboso, sin type inference), Yup (menos rendimiento), express-validator (menos funcional). |

---

## ADR-006: Swagger/OpenAPI para documentación de API

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos documentar la API REST para consumo propio y potenciales consumidores externos. |
| **Decisión** | Usar swagger-jsdoc + swagger-ui-express para generar y servir documentación OpenAPI 3.0. |
| **Justificación** | OpenAPI es el estándar de facto para documentación de APIs. swagger-jsdoc permite mantener la documentación cerca del código (comentarios JSDoc en rutas/controladores). swagger-ui-express sirve la interfaz visual interactiva. |
| **Consecuencias** | Mantenimiento adicional al actualizar documentación junto con el código. La generación desde JSDoc reduce la fricción. |
| **Alternativas** | Postman (no versionable con el código), Redoc (solo visualización, sin edición), documentación manual (propensa a quedar obsoleta). |

---

## ADR-007: Frontend y backend separados (SPA + API)

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos decidir la topología del despliegue. |
| **Decisión** | Frontend (React SPA) y backend (Express API) como proyectos separados, desplegados independientemente. |
| **Justificación** | Separación de concerns: fronten estático servido por CDN (Vercel), backend API en Railway. Permite escalar cada capa independientemente. Facilita el desarrollo local (frontend con Vite proxy al backend). |
| **Consecuencias** | Mayor latencia (round trip a dos dominios). Necesidad de configurar CORS. Más coste de despliegue (dos plataformas). |
| **Alternativas** | Monolito con SSR (Next.js) — simplifica despliegue pero acopla frontend y backend. |

---

## ADR-008: GitHub Flow + Conventional Commits

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos un flujo de trabajo Git y un estándar de commits. |
| **Decisión** | Usar GitHub Flow (main + feature branches, PRs a main) con Conventional Commits. |
| **Justificación** | GitHub Flow es el flujo más simple para proyectos pequeños: sin releases complicadas, sin ramas long-lived. Conventional Commits permite generación automática de changelog y versionado semántico. |
| **Consecuencias** | Disciplina requerida para mantener commits semánticos. CHANGELOG.md actualizable automáticamente con herramientas como standard-version. |
| **Alternativas** | Git Flow (más complejo, innecesario para proyecto pequeño), commits libres (falta de estandarización). |

---

## ADR-009: Variables de entorno para configuración

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos gestionar configuración sensible (DB URL, JWT secret, etc.) sin exponerla en el repositorio. |
| **Decisión** | Usar dotenv para desarrollo y variables de entorno nativas en producción (Vercel + Railway). |
| **Justificación** | dotenv carga `.env` en desarrollo (gitignorado). Vercel y Railway tienen sistemas nativos de variables de entorno para producción. Separación clara entre configuración y código (12 Factor App). |
| **Consecuencias** | .env.example versionado como plantilla. El equipo debe mantener .env.example actualizado. |
| **Alternativas** | JSON de configuración (no apto para secretos), vault/HashiCorp (sobreingeniería para MVP). |

---

## ADR-010: Vitest + React Testing Library para testing

| Campo | Valor |
|---|---|
| **Estado** | Aceptada |
| **Contexto** | Necesitamos un framework de testing para frontend y backend. |
| **Decisión** | Usar Vitest como test runner y React Testing Library para tests de componentes. |
| **Justificación** | Vitest es nativo de Vite (misma configuración, mismo transform), es extremadamente rápido (compilación en esbuild), y compatible con Jest API. React Testing Library fomenta tests centrados en el comportamiento del usuario, no en implementación. |
| **Consecuencias** | Tests de integración backend pueden usar Vitest también (un solo framework). Curva de aprendizaje baja si se conoce Jest. |
| **Alternativas** | Jest (más lento, configuración separada de Vite), Cypress (solo E2E, más pesado para unitarios), Testing Library + Jest (combinación común pero más lenta). |
