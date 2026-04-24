# Roadmap de Desarrollo

## Fase 0 — Fundación ✅

### Objetivo
Tener el esqueleto del proyecto funcionando: frontend sirviendo, backend respondiendo, base de datos conectada.

### Tareas
- [x] Inicializar monorepo (frontend Vite + backend Express)
- [x] Configurar Prisma + esquema inicial
- [x] Implementar auth endpoints (register, login, me)
- [x] Implementar middleware JWT
- [x] Crear layout base del frontend (Header, Sidebar, Router)
- [x] Implementar páginas de Login y Register (frontend)
- [x] Configurar Swagger/OpenAPI (infraestructura)
- [x] Configurar Helmet, CORS

### Hito
✅ API funcionando con auth + frontend con login funcional.

---

## Fase 1 — Tareas y Categorías ✅

### Objetivo
Módulo de tareas completo con categorías.

### Tareas
- [x] CRUD de categorías (backend + frontend)
- [x] CRUD de tareas (backend)
- [x] Página de tareas (frontend) con lista filtrable
- [x] Filtros combinados (estado + prioridad + categoría + fecha)
- [x] Modal de crear/editar tarea (frontend)
- [x] Acción rápida: marcar completada

### Hito
✅ Usuario puede gestionar tareas con categorías y filtros.

---

## Fase 2 — Hábitos ✅

### Objetivo
Módulo de hábitos con registro diario y rachas.

### Tareas
- [x] CRUD de hábitos (backend + frontend)
- [x] Registro diario de cumplimiento (backend + frontend)
- [x] Cálculo de rachas actual y más larga
- [x] Calendario mensual de cumplimiento (frontend)
- [x] Página de hábitos (frontend)

### Hito
✅ Usuario puede crear hábitos y mantener rachas.

---

## Fase 3 — Objetivos y Dashboard ✅

### Objetivo
Módulo de objetivos completo + dashboard que integra todo.

### Tareas
- [x] CRUD de objetivos (backend + frontend)
- [x] CRUD de hitos (backend + frontend)
- [x] Progreso automático (%)
- [x] Asociar tareas a objetivos (visualización)
- [x] Dashboard: vista de hoy (frontend)
- [x] Dashboard: vista semanal (frontend)
- [x] Resumen de objetivos activos en dashboard
- [x] Próximos hitos en dashboard

### Hito
✅ MVP funcional: usuario puede gestionar tareas, hábitos, objetivos y ver su semana.

---

## Fase 4 — Pulido y Despliegue ✅

### Objetivo
MVP pulido y preparado para desplegar.

### Tareas
- [x] Diseño responsive (sidebar colapsable en móvil)
- [x] Estados de carga, vacío y error en todas las vistas
- [x] Sistema de notificaciones toast
- [x] Configuración Vercel (frontend)
- [x] Configuración Railway / Procfile (backend)

### Hito
✅ MVP listo para despliegue y validación.

---

## Post-MVP (Futuro)

| Iteración | Contenido | Prioridad |
|---|---|---|
| **v1.1** | Notificaciones push/email, recuperación de contraseña | Alta |
| **v1.2** | Tareas recurrentes, subtareas | Alta |
| **v1.3** | Modo oscuro, temas personalizables | Media |
| **v1.4** | Exportación de datos (CSV, PDF) | Media |
| **v1.5** | Vista kanban de tareas | Baja |
| **v1.6** | Colaboración en objetivos | Baja |
| **v1.7** | Aplicación móvil (PWA o nativa) | Baja |
| **v1.8** | Integraciones (Google Calendar, Slack) | Baja |
| **—** | Tests automatizados (Vitest + RTL) | Alta |

## Resumen temporal

```
MVP completado. Pendiente: despliegue en producción.
```
