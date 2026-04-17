# Casos de Uso

## Actor principal

**Usuario** — persona registrada en Ronsel.

## Diagrama de casos de uso

```
                    ┌─────────────────────────────┐
                    │         USUARIO              │
                    └──────────────┬──────────────┘
                   ┌───────────────┼───────────────┐
                   │               │               │
          ┌────────┴──┐    ┌───────┴──────┐   ┌────┴──────┐
          │ Tareas     │    │  Hábitos     │   │ Objetivos  │
          └────────┬──┘    └───────┬──────┘   └────┬──────┘
                   │               │               │
          ┌────────┴───────────────┴───────────────┴────────┐
          │                 Dashboard                        │
          └──────────────────────────────────────────────────┘
```

## CU-01: Registrar usuario

| Campo | Valor |
|---|---|
| ID | CU-01 |
| Nombre | Registrar usuario |
| Actor | Usuario no autenticado |
| Precondición | No existe cuenta con ese email |
| Flujo principal | 1. El usuario accede a /register. 2. Introduce email, nombre y contraseña. 3. El sistema valida los datos. 4. El sistema crea la cuenta. 5. El sistema devuelve JWT. 6. El usuario es redirigido al dashboard. |
| Postcondición | Cuenta creada, sesión iniciada |
| Alternativas | 3a. Email ya registrado → error. 3b. Contraseña débil → error. |

## CU-02: Iniciar sesión

| Campo | Valor |
|---|---|
| ID | CU-02 |
| Nombre | Iniciar sesión |
| Actor | Usuario no autenticado |
| Precondición | Cuenta existente |
| Flujo principal | 1. El usuario accede a /login. 2. Introduce email y contraseña. 3. El sistema valida credenciales. 4. El sistema devuelve JWT. 5. Redirección al dashboard. |
| Postcondición | Sesión iniciada |
| Alternativas | 3a. Credenciales inválidas → error. |

## CU-03: Gestionar tareas

| Campo | Valor |
|---|---|
| ID | CU-03 |
| Nombre | Gestionar tareas |
| Actor | Usuario autenticado |
| Precondición | Sesión iniciada |
| Flujo principal | 1. Usuario navega a /tasks. 2. Ve lista de tareas (filtrable, ordenable). 3. Puede: crear, editar, eliminar, cambiar estado. 4. Los cambios se reflejan en tiempo real. |
| Sub-casos | CU-03.1 Crear tarea, CU-03.2 Editar tarea, CU-03.3 Eliminar tarea, CU-03.4 Completar tarea |

## CU-04: Gestionar hábitos

| Campo | Valor |
|---|---|
| ID | CU-04 |
| Nombre | Gestionar hábitos |
| Actor | Usuario autenticado |
| Precondición | Sesión iniciada |
| Flujo principal | 1. Usuario navega a /habits. 2. Ve lista de hábitos con estado de hoy. 3. Puede: crear, editar, eliminar, registrar cumplimiento. 4. Ve rachas y calendario. |
| Sub-casos | CU-04.1 Crear hábito, CU-04.2 Registrar cumplimiento, CU-04.3 Ver rachas |

## CU-05: Gestionar objetivos

| Campo | Valor |
|---|---|
| ID | CU-05 |
| Nombre | Gestionar objetivos |
| Actor | Usuario autenticado |
| Precondición | Sesión iniciada |
| Flujo principal | 1. Usuario navega a /goals. 2. Ve lista de objetivos con progreso. 3. Puede: crear, editar, eliminar, gestionar hitos, asociar tareas. |
| Sub-casos | CU-05.1 Crear objetivo, CU-05.2 Añadir hito, CU-05.3 Completar hito |

## CU-06: Ver dashboard

| Campo | Valor |
|---|---|
| ID | CU-06 |
| Nombre | Ver dashboard |
| Actor | Usuario autenticado |
| Precondición | Sesión iniciada |
| Flujo principal | 1. Usuario accede a la raíz /. 2. Ve resumen del día (tareas hoy, hábitos pendientes). 3. Ve vista semanal. 4. Ve objetivos activos con progreso. |

## CU-07: Gestionar categorías

| Campo | Valor |
|---|---|
| ID | CU-07 |
| Nombre | Gestionar categorías |
| Actor | Usuario autenticado |
| Precondición | Sesión iniciada |
| Flujo principal | 1. Usuario navega a /categories. 2. Ve lista de categorías. 3. Puede: crear, editar, eliminar categorías. |
