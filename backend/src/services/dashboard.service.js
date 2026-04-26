import prisma from '../prisma/index.js';

export async function getDashboard(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const [tasksToday, pendingHabits, goals, taskGroups] =
    await Promise.all([
      prisma.task.findMany({
        where: {
          userId,
          dueDate: { gte: today, lt: tomorrow },
          status: { not: 'COMPLETED' },
        },
        orderBy: { priority: 'desc' },
        include: { category: { select: { id: true, name: true, color: true } } },
      }),
      prisma.habit.findMany({
        where: {
          userId,
          habitLogs: { none: { date: today } },
        },
        include: { category: { select: { id: true, name: true, color: true } } },
      }),
      prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.task.groupBy({
        by: ['goalId', 'status'],
        where: {
          goal: { userId, status: 'ACTIVE' },
        },
        _count: { id: true },
      }),
    ]);

  const completedByGoal = {};
  const totalByGoal = {};
  for (const g of taskGroups) {
    totalByGoal[g.goalId] = (totalByGoal[g.goalId] || 0) + g._count.id;
    if (g.status === 'COMPLETED') {
      completedByGoal[g.goalId] = g._count.id;
    }
  }

  const goalsWithProgress = goals.map((goal) => {
    const total = totalByGoal[goal.id] || 0;
    const completed = completedByGoal[goal.id] || 0;
    return {
      id: goal.id,
      title: goal.title,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // Weekly view
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const weeklyTasks = await prisma.task.findMany({
    where: {
      userId,
      dueDate: { gte: startOfWeek, lt: endOfWeek },
      status: { not: 'CANCELLED' },
    },
    orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    include: { category: { select: { id: true, name: true, color: true } } },
  });

  const weeklyTasksByDay = weekDays.map((d) => {
    const end = new Date(d);
    end.setDate(end.getDate() + 1);
    return {
      date: d.toISOString().slice(0, 10),
      tasks: weeklyTasks.filter((t) => {
        if (!t.dueDate) return false;
        const td = new Date(t.dueDate);
        return td >= d && td < end;
      }),
    };
  });

  return {
    tasksToday,
    pendingHabits,
    activeGoals: goalsWithProgress,
    week: weeklyTasksByDay,
  };
}
