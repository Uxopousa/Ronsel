import prisma from '../prisma/index.js';
import ApiError from '../utils/ApiError.js';

export async function list(userId, filters = {}) {
  const where = { userId };

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.goalId) where.goalId = filters.goalId;
  if (filters.dueDateFrom || filters.dueDateTo) {
    where.dueDate = {};
    if (filters.dueDateFrom) where.dueDate.gte = new Date(filters.dueDateFrom);
    if (filters.dueDateTo) where.dueDate.lte = new Date(filters.dueDateTo);
  }

  const orderBy = {};
  if (filters.sortBy === 'dueDate') orderBy.dueDate = filters.sortOrder || 'asc';
  else if (filters.sortBy === 'priority') orderBy.priority = filters.sortOrder || 'desc';
  else orderBy.createdAt = 'desc';

  return prisma.task.findMany({
    where,
    orderBy,
    include: { category: { select: { id: true, name: true, color: true } } },
  });
}

export async function getById(userId, taskId) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { category: { select: { id: true, name: true, color: true } } },
  });
  if (!task) throw new ApiError(404, 'Tarea no encontrada');
  return task;
}

export async function create(userId, data) {
  return prisma.task.create({
    data: { ...data, userId },
    include: { category: { select: { id: true, name: true, color: true } } },
  });
}

export async function update(userId, taskId, data) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new ApiError(404, 'Tarea no encontrada');

  if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
    data.completedAt = new Date();
  }
  if (task.status === 'COMPLETED' && data.status && data.status !== 'COMPLETED') {
    data.completedAt = null;
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
    include: { category: { select: { id: true, name: true, color: true } } },
  });
}

export async function remove(userId, taskId) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new ApiError(404, 'Tarea no encontrada');

  await prisma.task.delete({ where: { id: taskId } });
}
