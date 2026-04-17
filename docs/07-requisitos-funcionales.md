# Requisitos Funcionales

## RF1 — Autenticación

| ID | Nombre | Descripción |
|---|---|---|
| RF1.1 | Registro | El sistema permitirá registrarse con email y contraseña. La contraseña se almacenará hasheada con bcrypt. |
| RF1.2 | Inicio de sesión | El sistema permitirá iniciar sesión con email y contraseña, devolviendo un JWT. |
| RF1.3 | Cierre de sesión | El sistema permitirá cerrar sesión invalidando el token del lado del cliente. |
| RF1.4 | Protección de rutas | Todas las rutas de la API (excepto registro y login) requerirán un JWT válido. |
| RF1.5 | Perfil básico | El sistema devolverá los datos del usuario autenticado (nombre, email, avatar). |

## RF2 — Tareas

| ID | Nombre | Descripción |
|---|---|---|
| RF2.1 | Crear tarea | El usuario podrá crear tareas con: título (obligatorio), descripción, prioridad, fecha de vencimiento, categoría. |
| RF2.2 | Editar tarea | El usuario podrá modificar cualquier campo de una tarea existente. |
| RF2.3 | Eliminar tarea | El usuario podrá eliminar una tarea. La eliminación será física (no lógica). |
| RF2.4 | Cambiar estado | El usuario podrá cambiar el estado entre: pendiente, en progreso, completada, cancelada. |
| RF2.5 | Listar tareas | El sistema listará las tareas del usuario con paginación. |
| RF2.6 | Filtrar tareas | El sistema permitirá filtrar por: estado, prioridad, categoría, fecha desde/hasta. |
| RF2.7 | Ordenar tareas | El sistema permitirá ordenar por: fecha de creación, fecha de vencimiento, prioridad. |

## RF3 — Hábitos

| ID | Nombre | Descripción |
|---|---|---|
| RF3.1 | Crear hábito | El usuario podrá crear hábitos con: nombre (obligatorio), descripción, frecuencia (diaria/semanal). |
| RF3.2 | Editar hábito | El usuario podrá modificar cualquier campo de un hábito existente. |
| RF3.3 | Eliminar hábito | El usuario podrá eliminar un hábito y todos sus registros asociados. |
| RF3.4 | Registrar cumplimiento | El usuario podrá marcar un hábito como completado para una fecha concreta. |
| RF3.5 | Desmarcar cumplimiento | El usuario podrá desmarcar un registro de hábito. |
| RF3.6 | Ver rachas | El sistema calculará y mostrará la racha actual y la racha más larga del hábito. |
| RF3.7 | Calendario mensual | El sistema mostrará un calendario con los días cumplidos/no cumplidos del mes. |
| RF3.8 | Listar hábitos | El sistema listará los hábitos del usuario con su estado de hoy. |

## RF4 — Objetivos

| ID | Nombre | Descripción |
|---|---|---|
| RF4.1 | Crear objetivo | El usuario podrá crear objetivos con: título (obligatorio), descripción, fecha inicio, fecha fin. |
| RF4.2 | Editar objetivo | El usuario podrá modificar cualquier campo de un objetivo existente. |
| RF4.3 | Eliminar objetivo | El usuario podrá eliminar un objetivo y sus hitos asociados. |
| RF4.4 | Añadir hito | El usuario podrá añadir hitos a un objetivo con título y fecha opcional. |
| RF4.5 | Completar hito | El usuario podrá marcar un hito como completado. |
| RF4.6 | Ver progreso | El sistema calculará el progreso como: (hitos completados / total hitos) × 100. |
| RF4.7 | Asociar tareas | El usuario podrá asociar tareas existentes a un objetivo. |
| RF4.8 | Listar objetivos | El sistema listará los objetivos del usuario con su progreso. |

## RF5 — Categorías

| ID | Nombre | Descripción |
|---|---|---|
| RF5.1 | Crear categoría | El usuario podrá crear categorías con: nombre (obligatorio), color (hex). |
| RF5.2 | Editar categoría | El usuario podrá modificar nombre y color de una categoría. |
| RF5.3 | Eliminar categoría | El usuario podrá eliminar una categoría. Las tareas asociadas quedarán sin categoría. |
| RF5.4 | Listar categorías | El sistema listará las categorías del usuario. |

## RF6 — Dashboard

| ID | Nombre | Descripción |
|---|---|---|
| RF6.1 | Vista hoy | El sistema mostrará: tareas con fecha de hoy (pendientes), hábitos pendientes de hoy, próximos hitos. |
| RF6.2 | Vista semanal | El sistema mostrará una cuadrícula semanal con tareas agrupadas por día, hábitos del día y progreso semanal de objetivos. |
| RF6.3 | Resumen objetivos | El sistema mostrará los objetivos activos con su porcentaje de progreso. |
