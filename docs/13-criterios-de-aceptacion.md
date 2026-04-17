# Criterios de Aceptación

## Formato

Cada criterio sigue el formato **Given-When-Then** (Dado-Cuando-Entonces) para claridad y testabilidad.

---

## CA-01: Registro de usuario

| Criterio | Descripción |
|---|---|
| CA-01.1 | **Dado** que un usuario no autenticado accede a /register, **cuando** introduce un email válido, nombre y contraseña (≥8 caracteres), **entonces** se crea la cuenta, se devuelve un JWT y se redirige al dashboard. |
| CA-01.2 | **Dado** que un usuario intenta registrarse, **cuando** el email ya existe, **entonces** se muestra un error "El email ya está registrado". |
| CA-01.3 | **Dado** que un usuario intenta registrarse, **cuando** la contraseña tiene menos de 8 caracteres, **entonces** se muestra un error "La contraseña debe tener al menos 8 caracteres". |
| CA-01.4 | **Dado** que un usuario intenta registrarse, **cuando** el email no tiene formato válido, **entonces** se muestra un error "Email inválido". |

## CA-02: Inicio de sesión

| Criterio | Descripción |
|---|---|
| CA-02.1 | **Dado** un usuario registrado, **cuando** introduce email y contraseña correctos, **entonces** se devuelve un JWT y se redirige al dashboard. |
| CA-02.2 | **Dado** un usuario registrado, **cuando** introduce contraseña incorrecta, **entonces** se muestra un error "Credenciales inválidas". |
| CA-02.3 | **Dado** un usuario registrado, **cuando** introduce un email inexistente, **entonces** se muestra un error "Credenciales inválidas" (sin revelar si el email existe). |

## CA-03: Gestión de tareas

| Criterio | Descripción |
|---|---|
| CA-03.1 | **Dado** un usuario autenticado en /tasks, **cuando** crea una tarea con título válido, **entonces** la tarea aparece en la lista inmediatamente. |
| CA-03.2 | **Dado** un usuario autenticado, **cuando** intenta crear una tarea sin título, **entonces** se muestra un error "El título es obligatorio". |
| CA-03.3 | **Dado** un usuario autenticado, **cuando** edita una tarea existente y guarda, **entonces** los cambios se reflejan en la lista. |
| CA-03.4 | **Dado** un usuario autenticado, **cuando** elimina una tarea, **entonces** la tarea desaparece de la lista y no puede recuperarse. |
| CA-03.5 | **Dado** un usuario autenticado, **cuando** marca una tarea como completada, **entonces** la tarea aparece visualmente como completada (tachada o diferente estilo) y se registra completedAt. |
| CA-03.6 | **Dado** un usuario autenticado, **cuando** aplica un filtro de estado "pendiente", **entonces** solo se muestran tareas con estado pendiente. |
| CA-03.7 | **Dado** un usuario autenticado, **cuando** aplica múltiples filtros simultáneamente, **entonces** se muestran tareas que cumplen TODOS los filtros. |

## CA-04: Gestión de hábitos

| Criterio | Descripción |
|---|---|
| CA-04.1 | **Dado** un usuario autenticado, **cuando** crea un hábito con nombre y frecuencia, **entonces** el hábito aparece en la lista. |
| CA-04.2 | **Dado** un usuario autenticado en la página de hábitos, **cuando** marca un hábito como completado hoy, **entonces** el hábito aparece como completado y la racha actual aumenta en 1. |
| CA-04.3 | **Dado** un usuario autenticado, **cuando** desmarca un hábito completado hoy, **entonces** el hábito vuelve a estado pendiente y la racha actual se recalcula. |
| CA-04.4 | **Dado** un usuario autenticado, **cuando** ve la racha más larga, **entonces** el número mostrado es correcto considerando todo el historial del hábito. |
| CA-04.5 | **Dado** un usuario autenticado, **cuando** ve el calendario mensual de un hábito, **entonces** se muestran los días del mes coloreados según completado/no completado. |

## CA-05: Gestión de objetivos

| Criterio | Descripción |
|---|---|
| CA-05.1 | **Dado** un usuario autenticado, **cuando** crea un objetivo con título y fechas, **entonces** el objetivo aparece en la lista con progreso 0%. |
| CA-05.2 | **Dado** un usuario autenticado, **cuando** añade 3 hitos a un objetivo y completa 1, **entonces** el progreso mostrado es 33%. |
| CA-05.3 | **Dado** un usuario autenticado, **cuando** completa todos los hitos de un objetivo, **entonces** el estado del objetivo cambia a "completado". |
| CA-05.4 | **Dado** un usuario autenticado, **cuando** asocia una tarea a un objetivo, **entonces** al ver el objetivo se muestra la tarea asociada. |

## CA-06: Dashboard

| Criterio | Descripción |
|---|---|
| CA-06.1 | **Dado** un usuario autenticado en el dashboard, **cuando** tiene tareas con fecha de hoy pendientes, **entonces** aparecen en la sección "Hoy". |
| CA-06.2 | **Dado** un usuario autenticado en el dashboard, **cuando** tiene hábitos sin marcar hoy, **entonces** aparecen en la sección "Hábitos pendientes". |
| CA-06.3 | **Dado** un usuario autenticado en el dashboard, **cuando** tiene objetivos activos, **entonces** se muestran con su barra de progreso. |
| CA-06.4 | **Dado** un usuario autenticado en la vista semanal, **cuando** navega a una semana, **entonces** ve tareas agrupadas por día y hábitos planificados. |

## CA-07: Seguridad y acceso

| Criterio | Descripción |
|---|---|
| CA-07.1 | **Dado** un usuario no autenticado, **cuando** intenta acceder a cualquier ruta protegida, **entonces** recibe un error 401. |
| CA-07.2 | **Dado** un usuario autenticado, **cuando** intenta acceder a tareas/hábitos/objetivos de otro usuario manipulando IDs, **entonces** recibe un error 403 o 404. |
| CA-07.3 | **Dado** un usuario, **cuando** su JWT ha expirado, **entonces** recibe un error 401 y es redirigido al login. |

## CA-08: Rendimiento

| Criterio | Descripción |
|---|---|
| CA-08.1 | **Dado** un usuario autenticado, **cuando** carga el dashboard, **entonces** la página se renderiza completamente en menos de 2 segundos (conexión de banda ancha). |
| CA-08.2 | **Dado** un usuario autenticado, **cuando** lista tareas con filtros, **entonces** la respuesta de la API llega en menos de 500ms (p95). |
