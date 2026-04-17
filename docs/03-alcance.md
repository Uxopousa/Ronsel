# Alcance del Producto

## Dentro del alcance (MVP)

### Módulo de autenticación
- Registro de usuario (email + contraseña)
- Inicio de sesión
- Cierre de sesión
- Protección de rutas (JWT)

### Módulo de tareas
- CRUD completo de tareas
- Estado: pendiente, en progreso, completada, cancelada
- Prioridad: baja, media, alta
- Fecha de vencimiento
- Categorización
- Filtros por estado, prioridad, categoría, fecha

### Módulo de hábitos
- CRUD de hábitos
- Registro diario de cumplimiento (sí/no)
- Frecuencia configurable (diaria, semanal, personalizada)
- Visualización de rachas (current streak, longest streak)
- Calendario de cumplimiento mensual

### Módulo de objetivos
- CRUD de objetivos
- Fechas de inicio y fin
- Hitos (milestones) con estado completado/pendiente
- Barra de progreso automática (%)
- Relación con tareas (una tarea puede pertenecer a un objetivo)

### Dashboard / visión general
- Resumen del día: tareas del día, hábitos pendientes, próximo hito
- Vista semanal con planificación

### Aspectos técnicos (MVP)
- API REST con Express.js
- Base de datos PostgreSQL con Prisma ORM
- Frontend SPA con React + Vite
- Autenticación JWT
- Documentación Swagger/OpenAPI de la API
- Despliegue: Vercel (frontend) + Railway (backend) + Neon (DB)

## Fuera del alcance (MVP)

- Colaboración entre usuarios / equipos
- Notificaciones push / email
- Aplicaciones móviles nativas (iOS/Android)
- Modo offline / PWA
- Integraciones con terceros (Google Calendar, Slack, etc.)
- Sistema de etiquetas avanzado
- IA / sugerencias automáticas
- Tareas recurrentes automáticas (todavía)
- Exportación avanzada (PDF, CSV)
- Temas / personalización visual avanzada
- Roles y permisos
- Audit logging

## Post-MVP (futuras iteraciones)

Lo anterior podrá incorporarse en versiones posteriores según feedback y prioridades.
