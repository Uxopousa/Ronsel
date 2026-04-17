import prisma from '../prisma/index.js';
import ApiError from '../utils/ApiError.js';

export async function list(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, color: true } },
      habitLogs: {
        where: { date: today },
        take: 1,
      },
    },
  });

  return habits.map((h) => ({
    ...h,
    completedToday: h.habitLogs.length > 0 && h.habitLogs[0].completed,
    habitLogs: undefined,
  }));
}

export async function getById(userId, id) {
  const habit = await prisma.habit.findFirst({
    where: { id, userId },
    include: { category: { select: { id: true, name: true, color: true } } },
  });
  if (!habit) throw new ApiError(404, 'Hábito no encontrado');
  return habit;
}

export async function create(userId, data) {
  return prisma.habit.create({
    data: { ...data, userId },
    include: { category: { select: { id: true, name: true, color: true } } },
  });
}

export async function update(userId, id, data) {
  const habit = await prisma.habit.findFirst({ where: { id, userId } });
  if (!habit) throw new ApiError(404, 'Hábito no encontrado');

  return prisma.habit.update({
    where: { id },
    data,
    include: { category: { select: { id: true, name: true, color: true } } },
  });
}

export async function remove(userId, id) {
  const habit = await prisma.habit.findFirst({ where: { id, userId } });
  if (!habit) throw new ApiError(404, 'Hábito no encontrado');

  await prisma.habit.delete({ where: { id } });
}

export async function toggleLog(userId, habitId, date) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });
  if (!habit) throw new ApiError(404, 'Hábito no encontrado');

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: startOfDay } },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
    await recalculateStreak(habitId);
    return { completed: false };
  }

  await prisma.habitLog.create({
    data: { habitId, date: startOfDay, completed: true },
  });
  await recalculateStreak(habitId);
  return { completed: true };
}

async function recalculateStreak(habitId) {
  const logs = await prisma.habitLog.findMany({
    where: { habitId },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkedDates = new Set();
  for (const log of logs) {
    const d = new Date(log.date);
    d.setHours(0, 0, 0, 0);
    checkedDates.add(d.getTime());
  }

  let checkDate = new Date(today);
  while (checkedDates.has(checkDate.getTime())) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const sortedDates = [...checkedDates].sort((a, b) => a - b);
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || sortedDates[i] - sortedDates[i - 1] === 86400000) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  await prisma.habit.update({
    where: { id: habitId },
    data: { currentStreak, longestStreak },
  });
}

export async function getCalendar(userId, habitId, year, month) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });
  if (!habit) throw new ApiError(404, 'Hábito no encontrado');

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
      date: { gte: startDate, lte: endDate },
    },
    select: { date: true, completed: true },
    orderBy: { date: 'asc' },
  });

  const days = {};
  for (const log of logs) {
    const key = new Date(log.date).getDate();
    days[key] = log.completed;
  }

  return { year, month, days };
}
