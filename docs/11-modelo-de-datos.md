# Modelo de Datos

## Diagrama entidad-relación

```
┌─────────────┐     ┌──────────────────┐
│   User      │     │   Category       │
├─────────────┤     ├──────────────────┤
│ id (PK)     │     │ id (PK)          │
│ email (U)   │     │ name             │
│ password    │     │ color            │
│ name        │     │ userId (FK)      │
│ createdAt   │     │ createdAt        │
│ updatedAt   │     └────────┬─────────┘
└──────┬──────┘              │
       │                     │
       │ 1                  N│
       │                     │
       │    ┌────────────────┴────────────┐
       │    │  Task                       │
       │    ├──────────────────────────────┤
       │    │ id (PK)                     │
       │    │ title                       │
       │    │ description?                │
       │    │ status: enum                │
       │    │ priority: enum              │
       │    │ dueDate?                    │
       │    │ completedAt?                │
       │    │ userId (FK)                 │
       │    │ categoryId (FK) (N)         │
       │    │ goalId (FK) (N)             │
       │    │ createdAt                   │
       │    │ updatedAt                   │
       │    └─────────────────────────────┘
       │
       │    ┌──────────────────────────────┐
       │    │  Habit                       │
       │    ├──────────────────────────────┤
       │    │ id (PK)                     │
       │    │ name                        │
       │    │ description?                │
       │    │ frequency: enum (daily/weekly)│
       │    │ targetPerWeek?              │
       │    │ currentStreak               │
       │    │ longestStreak               │
       │    │ userId (FK)                 │
       │    │ categoryId (FK) (N)         │
       │    │ createdAt                   │
       │    │ updatedAt                   │
       │    └──────────────┬───────────────┘
       │                   │
       │                 1 │
       │                   │
       │    ┌──────────────┴───────────────┐
       │    │  HabitLog                    │
       │    ├──────────────────────────────┤
       │    │ id (PK)                     │
       │    │ habitId (FK)                │
       │    │ date                        │
       │    │ completed: boolean          │
       │    │ createdAt                   │
       │    └──────────────────────────────┘
       │
       │    ┌──────────────────────────────┐
       │    │  Goal                        │
       │    ├──────────────────────────────┤
       │    │ id (PK)                     │
       │    │ title                       │
       │    │ description?                │
       │    │ startDate                   │
       │    │ targetDate?                 │
       │    │ status: enum                │
       │    │ userId (FK)                 │
       │    │ createdAt                   │
       │    │ updatedAt                   │
        │    └───────────────────────────────┘
```

## Esquema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

enum HabitFrequency {
  DAILY
  WEEKLY
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tasks      Task[]
  habits     Habit[]
  goals      Goal[]
  categories Category[]
}

model Category {
  id        String   @id @default(cuid())
  name      String
  color     String   @default("#6366f1")
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks Task[]
  habits Habit[]

  @@unique([userId, name])
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  completedAt DateTime?
  userId      String
  categoryId  String?
  goalId      String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  goal     Goal?     @relation(fields: [goalId], references: [id], onDelete: SetNull)

  @@index([userId, status])
  @@index([userId, dueDate])
  @@index([userId, priority])
  @@index([userId, categoryId])
  @@index([userId, goalId])
}

model Habit {
  id             String         @id @default(cuid())
  name           String
  description    String?
  frequency      HabitFrequency @default(DAILY)
  targetPerWeek  Int?
  currentStreak  Int            @default(0)
  longestStreak  Int            @default(0)
  userId         String
  categoryId     String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  category  Category?  @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  habitLogs HabitLog[]

  @@index([userId])
}

model HabitLog {
  id        String   @id @default(cuid())
  habitId   String
  date      DateTime @db.Date
  completed Boolean  @default(true)
  createdAt DateTime @default(now())

  habit Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@unique([habitId, date])
  @@index([habitId, date])
}

model Goal {
  id          String     @id @default(cuid())
  title       String
  description String?
  startDate   DateTime
  targetDate  DateTime?
  status      GoalStatus @default(ACTIVE)
  userId      String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user       User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks      Task[]

  @@index([userId, status])
}
```

## Índices

| Tabla | Índices |
|---|---|
| User | `email` (unique) |
| Category | `[userId, name]` (unique compuesto) |
| Task | `[userId, status]`, `[userId, dueDate]`, `[userId, priority]`, `[userId, categoryId]`, `[userId, goalId]` |
| Habit | `[userId]` |
| HabitLog | `[habitId, date]` (unique compuesto), `[habitId, date]` |
| Goal | `[userId, status]` |

## Relaciones clave

| Relación | Tipo | Explicación |
|---|---|---|
| User → Task | 1:N | Un usuario puede tener muchas tareas |
| User → Habit | 1:N | Un usuario puede tener muchos hábitos |
| User → Goal | 1:N | Un usuario puede tener muchos objetivos |
| User → Category | 1:N | Un usuario puede tener muchas categorías |
| Habit → HabitLog | 1:N | Un hábito tiene muchos registros diarios |
| Goal → Task | 1:N | Un objetivo puede tener muchas tareas asociadas |
| Category → Task | 1:N | Una categoría puede tener muchas tareas |
| Category → Habit | 1:N | Una categoría puede tener muchos hábitos |

## Notas

- `HabitLog.date` usa `@db.Date` (solo fecha, sin hora) para facilitar consultas de día.
- El unique compuesto `[habitId, date]` en HabitLog evita registros duplicados.
- `onDelete: Cascade` en relaciones User asegura limpieza al eliminar cuenta.
- `onDelete: SetNull` en categoría y objetivo de Task evita perder tareas al eliminar una categoría/objetivo.
