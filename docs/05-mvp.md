# MVP — Minimum Viable Product

## Definición

El MVP de Ronsel es una aplicación web funcional que cubre el ciclo básico de productividad personal: **capturar tareas, registrar hábitos y definir objetivos**, todo integrado en una vista semanal que da contexto al usuario.

## Objetivo del MVP

Validar la hipótesis principal:

> Unificar tareas, hábitos y objetivos en una sola interfaz simple mejora la adherencia del usuario a sus rutinas de productividad frente a usar herramientas separadas.

## Funcionalidades incluidas

### Autenticación
- Registro e inicio de sesión con email + contraseña (JWT)
- Cierre de sesión

### Módulo de tareas
- CRUD completo
- Estados: pendiente, en progreso, completada, cancelada
- Prioridades: baja, media, alta
- Fecha de vencimiento
- Categorización
- Filtros combinados (estado + prioridad + categoría + fecha)

### Módulo de hábitos
- CRUD completo
- Frecuencia diaria/semanal
- Registro diario de cumplimiento
- Rachas: actual y más larga
- Calendario mensual de cumplimiento

### Módulo de objetivos
- CRUD completo
- Fechas de inicio y fin
- Hitos con estado completado/pendiente
- Progreso automático (%)

### Dashboard / Vista semanal
- Resumen del día (tareas de hoy, hábitos pendientes)
- Vista semanal con tareas, hábitos y objetivos de la semana
- Atajos rápidos: añadir tarea, registrar hábito

### Categorías
- CRUD de categorías con nombre y color
- Asignación a tareas y hábitos

### Técnico
- API REST con Express.js
- Base de datos PostgreSQL con Prisma
- Documentación Swagger/OpenAPI
- Validación Zod
- Seguridad: Helmet, CORS, JWT
- Frontend React + Vite responsive
- Despliegue: Vercel + Railway + Neon

## Criterios de éxito del MVP

1. Un usuario puede registrarse, crear tareas, registrar hábitos y definir objetivos en **menos de 5 minutos** desde que llega a la app.
2. La vista semanal muestra correctamente todas las tareas, hábitos y objetivos del usuario.
3. El tiempo de carga de cualquier vista es inferior a 2 segundos.
4. Cobertura de test > 70% en lógica crítica (opcional para MVP, recomendado).
5. 0 errores críticos conocidos en el flujo principal.

## Lo que NO incluye el MVP

- Notificaciones (push/email)
- Modo offline
- App móvil nativa
- Colaboración
- Integraciones externas
- Tareas recurrentes
- Subtareas
- IA / sugerencias
- Recuperación de contraseña
- Verificación de email
