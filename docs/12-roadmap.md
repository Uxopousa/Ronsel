# Roadmap de Desarrollo

## Fase 0 — Fundación (Semanas 1-3)

### Objetivo
Tener el esqueleto del proyecto funcionando: frontend sirviendo, backend respondiendo, base de datos conectada.

### Tareas
- [ ] Inicializar monorepo (frontend Vite + backend Express)
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Prisma + esquema inicial + migración
- [ ] Configurar Neon PostgreSQL
- [ ] Implementar auth endpoints (register, login)
- [ ] Implementar middleware JWT
- [ ] Crear layout base del frontend (Header, Sidebar, Router)
- [ ] Implementar páginas de Login y Register (frontend)
- [ ] Configurar Swagger/OpenAPI
- [ ] Configurar Helmet, CORS
- [ ] CI básico (lint + build en GitHub Actions)

### Hito
✅ API funcionando con auth + frontend con login funcional.

### Dependencias
Ninguna.

---

## Fase 1 — Tareas y Categorías (Semanas 4-6)

### Objetivo
Módulo de tareas completo con categorías.

### Tareas
- [ ] CRUD de categorías (backend + frontend)
- [ ] CRUD de tareas (backend)
- [ ] Página de tareas (frontend) con lista filtrable
- [ ] Filtros combinados (estado + prioridad + categoría + fecha)
- [ ] Modal de crear/editar tarea (frontend)
- [ ] Acción rápida: marcar completada

### Hito
✅ Usuario puede gestionar tareas con categorías y filtros.

### Dependencias
Fase 0 completada.

---

## Fase 2 — Hábitos (Semanas 7-8)

### Objetivo
Módulo de hábitos con registro diario y rachas.

### Tareas
- [ ] CRUD de hábitos (backend + frontend)
- [ ] Registro diario de cumplimiento (backend + frontend)
- [ ] Cálculo de rachas actual y más larga
- [ ] Calendario mensual de cumplimiento (frontend)
- [ ] Página de hábitos (frontend)

### Hito
✅ Usuario puede crear hábitos y mantener rachas.

### Dependencias
Fase 1 completada.

---

## Fase 3 — Objetivos y Dashboard (Semanas 9-11)

### Objetivo
Módulo de objetivos completo + dashboard que integra todo.

### Tareas
- [ ] CRUD de objetivos (backend + frontend)
- [ ] CRUD de hitos (backend + frontend)
- [ ] Progreso automático (%)
- [ ] Asociar tareas a objetivos
- [ ] Dashboard: vista de hoy (frontend)
- [ ] Dashboard: vista semanal (frontend)
- [ ] Resumen de objetivos activos en dashboard

### Hito
✅ MVP funcional: usuario puede gestionar tareas, hábitos, objetivos y ver su semana.

### Dependencias
Fases 1 y 2 completadas.

---

## Fase 4 — Pulido y Despliegue (Semana 12)

### Objetivo
MVP desplegado y accesible públicamente.

### Tareas
- [ ] Responsive design completo (mobile)
- [ ] Estados de carga, vacío y error en todas las vistas
- [ ] Manejo global de errores (frontend + backend)
- [ ] Mejoras de UX (tooltips, atajos, animaciones sutiles)
- [ ] Despliegue frontend en Vercel
- [ ] Despliegue backend en Railway
- [ ] Variables de entorno configuradas en producción
- [ ] Smoke test post-despliegue

### Hito
✅ MVP desplegado y listo para validación con usuarios reales.

### Dependencias
Fase 3 completada.

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

## Resumen temporal

```
Sem   1  2  3 │  4  5  6 │  7  8 │  9 10 11 │ 12
Fase    0     │    1     │   2   │    3     │  4
              │          │       │          │
Hito:   API   │  Tareas  │Hábitos│ Objetivos│ MVP
        auth  │  +cats   │       │+Dashboard│ LIVE!
```
