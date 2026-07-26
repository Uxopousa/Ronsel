import prisma from '../prisma/index.js';

const SEED_DATA = {
  categories: [
    { name: 'Trabajo', color: '#3B82F6' },
    { name: 'Personal', color: '#10B981' },
    { name: 'Salud', color: '#F59E0B' },
  ],
  tasks: [
    { title: 'Responder correos pendientes', priority: 'HIGH', status: 'PENDING' },
    { title: 'Revisar informe mensual', priority: 'MEDIUM', status: 'PENDING' },
    { title: 'Comprar regalo cumpleaños', priority: 'LOW', status: 'PENDING' },
    { title: 'Hacer la compra semanal', priority: 'MEDIUM', status: 'PENDING' },
    { title: 'Leer el libro de productividad', priority: 'LOW', status: 'COMPLETED' },
  ],
  habits: [
    { name: 'Meditar 10 min', frequency: 'DAILY' },
    { name: 'Beber 2L de agua', frequency: 'DAILY' },
    { name: 'Leer 30 min', frequency: 'DAILY' },
    { name: 'Ejercicio', frequency: 'WEEKLY', targetPerWeek: 3 },
  ],
  goals: [
    {
      title: 'Aprender TypeScript',
      description: 'Completar curso online y hacer un proyecto',
      startDate: new Date(),
      targetDate: new Date(Date.now() + 90 * 86400000),
      status: 'ACTIVE',
    },
    {
      title: 'Poner en forma',
      description: 'Hacer ejercicio 3 veces por semana durante 3 meses',
      startDate: new Date(),
      targetDate: new Date(Date.now() + 60 * 86400000),
      status: 'ACTIVE',
    },
  ],
};

export async function seed(userId) {
  const created = { tasks: 0, habits: 0, goals: 0, categories: 0 };

  for (const cat of SEED_DATA.categories) {
    await prisma.category.upsert({
      where: { userId_name: { userId, name: cat.name } },
      update: {},
      create: { ...cat, userId },
    });
    created.categories++;
  }

  const cats = await prisma.category.findMany({ where: { userId } });

  function getCat(name) {
    return cats.find((c) => c.name === name)?.id || undefined;
  }

  for (const t of SEED_DATA.tasks) {
    const catId = t.title === 'Responder correos pendientes' ? getCat('Trabajo')
      : t.title === 'Revisar informe mensual' ? getCat('Trabajo')
      : t.title === 'Hacer la compra semanal' ? getCat('Personal')
      : t.title === 'Leer el libro de productividad' ? getCat('Personal')
      : t.title === 'Comprar regalo cumpleaños' ? getCat('Personal')
      : undefined;
    const dueDate = t.status === 'COMPLETED'
      ? new Date(Date.now() - 86400000)
      : new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000);
    await prisma.task.create({
      data: { ...t, dueDate, categoryId: catId, userId },
    });
    created.tasks++;
  }

  for (const h of SEED_DATA.habits) {
    const catId = h.name === 'Ejercicio' ? getCat('Salud')
      : h.name === 'Meditar 10 min' ? getCat('Salud')
      : undefined;
    const habit = await prisma.habit.create({
      data: { ...h, categoryId: catId, userId },
    });
    if (h.frequency === 'DAILY') {
      await prisma.habitLog.create({
        data: { habitId: habit.id, date: new Date(), completed: Math.random() > 0.5 },
      });
    }
    created.habits++;
  }

  for (const g of SEED_DATA.goals) {
    await prisma.goal.create({ data: { ...g, userId } });
    created.goals++;
  }

  return created;
}

export async function wipe(userId) {
  const counts = await prisma.$transaction(async (tx) => {
    const tasks = await tx.task.deleteMany({ where: { userId } });
    const habits = await tx.habit.deleteMany({ where: { userId } });
    const goals = await tx.goal.deleteMany({ where: { userId } });
    const categories = await tx.category.deleteMany({ where: { userId } });
    return { tasks: tasks.count, habits: habits.count, goals: goals.count, categories: categories.count };
  });
  return counts;
}
