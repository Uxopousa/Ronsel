import prisma from '../prisma/index.js';
import ApiError from '../utils/ApiError.js';

export async function list(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function create(userId, data) {
  const existing = await prisma.category.findUnique({
    where: { userId_name: { userId, name: data.name } },
  });
  if (existing) throw new ApiError(400, 'Ya existe una categoría con ese nombre');

  return prisma.category.create({
    data: { ...data, userId },
  });
}

export async function update(userId, categoryId, data) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) throw new ApiError(404, 'Categoría no encontrada');

  if (data.name) {
    const existing = await prisma.category.findUnique({
      where: { userId_name: { userId, name: data.name } },
    });
    if (existing && existing.id !== categoryId) {
      throw new ApiError(400, 'Ya existe una categoría con ese nombre');
    }
  }

  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
}

export async function remove(userId, categoryId) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) throw new ApiError(404, 'Categoría no encontrada');

  await prisma.category.delete({ where: { id: categoryId } });
}
