// Componentes Skeleton para estados de carga
// Animación: shimmer que se mueve de izquierda a derecha

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-neutral-700 rounded ${className}`}
    />
  );
}

export function SkeletonCircle({ size = 'w-8 h-8' }) {
  return <Skeleton className={`${size} rounded-full`} />;
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// --- Skeletons específicos de Ronsel ---

export function SkeletonSummaryCard() {
  return (
    <div className="card p-4 flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function SkeletonTaskItem({ showCategory = true }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-48" />
          {showCategory && <Skeleton className="h-4 w-14 rounded-sm" />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function SkeletonTaskList({ rows = 5, showCategory = true }) {
  return (
    <div className="card divide-y divide-gray-50 dark:divide-neutral-700 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTaskItem key={i} showCategory={showCategory} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-5xl animate-fade-in">
      {/* Título */}
      <Skeleton className="h-5 w-48 mb-5" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
      </div>

      {/* Alert placeholder */}
      <Skeleton className="h-11 w-full rounded-md mb-6" />

      {/* Sección tareas */}
      <Skeleton className="h-4 w-32 mb-3" />
      <SkeletonTaskList rows={3} showCategory={true} />

      {/* Separación */}
      <div className="my-6" />

      {/* Calendario skeleton */}
      <Skeleton className="h-4 w-24 mb-4" />
      <div className="card p-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 5 }).map((_, row) => (
            Array.from({ length: 7 }).map((_, col) => (
              <Skeleton key={`${row}-${col}`} className="h-14 w-full rounded-md" />
            ))
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTasksPage() {
  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* Search bar + filters */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-md" />
      </div>

      {/* Quick filters */}
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-md" />
        ))}
      </div>

      {/* Task list */}
      <SkeletonTaskList rows={6} showCategory={true} />
    </div>
  );
}

export function SkeletonFullPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

export function SkeletonDemoRedirect() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        {/* Logo placeholder */}
        <Skeleton className="w-12 h-12 rounded-xl" />
        {/* Brand name */}
        <Skeleton className="h-5 w-24" />
        {/* Subtle loading indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <Skeleton className="h-3 w-40 mt-1" />
      </div>
    </div>
  );
}

export function SkeletonHabitsPage() {
  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-3 flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>

      {/* Habit cards */}
      <div className="space-y-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-7 h-7 rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="w-2.5 h-2.5 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGoalsPage() {
  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Goal cards */}
      <div className="space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-1.5 w-16 rounded-full" />
                <Skeleton className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
