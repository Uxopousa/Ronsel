import prisma from '../prisma/index.js';
import ApiError from '../utils/ApiError.js';

export async function list(userId) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      milestones: true,
      _count: { select: { tasks: true } },
    },
  });

  return goals.map(attachProgress);
}

export async function getById(userId, id) {
  const goal = await prisma.goal.findFirst({
    where: { id, userId },
    include: {
      milestones: { orderBy: { createdAt: 'asc' } },
      tasks: {
        include: { category: { select: { id: true, name: true, color: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');
  return attachProgress(goal);
}

export async function create(userId, data) {
  const goal = await prisma.goal.create({
    data: { ...data, userId },
    include: { milestones: true },
  });
  return attachProgress(goal);
}

export async function update(userId, id, data) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const updated = await prisma.goal.update({
    where: { id },
    data,
    include: { milestones: true },
  });
  return attachProgress(updated);
}

export async function remove(userId, id) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  await prisma.goal.delete({ where: { id } });
}

export async function addMilestone(userId, goalId, data) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const milestone = await prisma.goalMilestone.create({
    data: { ...data, goalId },
  });

  return milestone;
}

export async function updateMilestone(userId, goalId, milestoneId, data) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const milestone = await prisma.goalMilestone.findFirst({
    where: { id: milestoneId, goalId },
  });
  if (!milestone) throw new ApiError(404, 'Hito no encontrado');

  if (data.completed === true && !milestone.completed) {
    data.completedAt = new Date();
  }
  if (data.completed === false) {
    data.completedAt = null;
  }

  return prisma.goalMilestone.update({
    where: { id: milestoneId },
    data,
  });
}

export async function removeMilestone(userId, goalId, milestoneId) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new ApiError(404, 'Objetivo no encontrado');

  const milestone = await prisma.goalMilestone.findFirst({
    where: { id: milestoneId, goalId },
  });
  if (!milestone) throw new ApiError(404, 'Hito no encontrado');

  await prisma.goalMilestone.delete({ where: { id: milestoneId } });
}

function attachProgress(goal) {
  const total = goal.milestones.length;
  const completed = goal.milestones.filter((m) => m.completed).length;
  return {
    ...goal,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
