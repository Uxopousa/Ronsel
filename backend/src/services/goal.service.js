import prisma from '../prisma/index.js';
import ApiError from '../utils/ApiError.js';

export async function list(userId) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const goalIds = goals.map(g => g.id);
  const taskGroups = await prisma.task.groupBy({
    by: ['goalId', 'status'],
    where: { goalId: { in: goalIds } },
    _count: { id: true },
  });

  const completedByGoal = {};
  const totalByGoal = {};
  for (const g of taskGroups) {
    totalByGoal[g.goalId] = (totalByGoal[g.goalId] || 0) + g._count.id;
    if (g.status === 'COMPLETED') {
      completedByGoal[g.goalId] = g._count.id;
    }
  }

  return goals.map(goal => {
    const total = totalByGoal[goal.id] || 0;
    const completed = completedByGoal[goal.id] || 0;
    return {
      ...goal,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalTasks: total,
      completedTasks: completed,
    };
  });
}

export async function getById(userId, id) {
  const goal = await prisma.goal.findFirst({
    where: { id, userId },
    include: {
      tasks: {
        include: { category: { select: { id: true, name: true, color: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const total = goal.tasks.length;
  const completed = goal.tasks.filter(t => t.status === 'COMPLETED').length;
  return {
    ...goal,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalTasks: total,
    completedTasks: completed,
  };
}

export async function create(userId, data) {
  const goal = await prisma.goal.create({
    data: { ...data, userId },
  });
  return { ...goal, progress: 0, totalTasks: 0, completedTasks: 0 };
}

export async function update(userId, id, data) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const updated = await prisma.goal.update({
    where: { id },
    data,
  });

  const tasks = await prisma.task.findMany({
    where: { goalId: updated.id },
    select: { status: true },
  });
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  return {
    ...updated,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalTasks: total,
    completedTasks: completed,
  };
}

export async function remove(userId, id) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  await prisma.goal.delete({ where: { id } });
}
