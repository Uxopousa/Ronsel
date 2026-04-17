import prisma from '../prisma/index.js';

export async function getDashboard(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [tasksToday, pendingHabits, activeGoals] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId,
        dueDate: { gte: today, lt: tomorrow },
        status: { not: 'COMPLETED' },
      },
      orderBy: { priority: 'desc' },
    }),
    prisma.habit.findMany({
      where: {
        userId,
        habitLogs: { none: { date: today } },
      },
    }),
    prisma.goal.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        milestones: { select: { id: true, completed: true } },
      },
    }),
  ]);

  const goalsWithProgress = activeGoals.map((goal) => {
    const total = goal.milestones.length;
    const completed = goal.milestones.filter((m) => m.completed).length;
    return {
      id: goal.id,
      title: goal.title,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  return {
    tasksToday,
    pendingHabits,
    activeGoals: goalsWithProgress,
  };
}
