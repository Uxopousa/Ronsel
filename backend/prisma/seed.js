import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos...');

  const password = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@ronsel.app' },
    update: {},
    create: {
      email: 'demo@ronsel.app',
      password,
      name: 'Usuario Demo',
    },
  });
  console.log(`  ✓ Usuario creado: ${user.email} / password123`);

  const categoryData = [
    { name: 'Trabajo', color: '#6366f1' },
    { name: 'Personal', color: '#22c55e' },
    { name: 'Salud', color: '#ef4444' },
    { name: 'Estudios', color: '#f59e0b' },
    { name: 'Finanzas', color: '#14b8a6' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: cat.name } },
      update: {},
      create: { ...cat, userId: user.id },
    });
    categories[cat.name] = created;
  }
  console.log(`  ✓ ${categoryData.length} categorías creadas`);

  const taskData = [
    { title: 'Preparar presentación trimestral', priority: 'HIGH', category: 'Trabajo', dueDate: new Date(Date.now() + 86400000 * 2) },
    { title: 'Responder emails pendientes', priority: 'MEDIUM', category: 'Trabajo', dueDate: new Date() },
    { title: 'Comprar regalo de cumpleaños', priority: 'MEDIUM', category: 'Personal', dueDate: new Date(Date.now() + 86400000 * 5) },
    { title: 'Correr 30 minutos', priority: 'LOW', category: 'Salud', dueDate: new Date() },
    { title: 'Leer capítulo 3 del libro', priority: 'LOW', category: 'Estudios', dueDate: new Date(Date.now() + 86400000 * 3) },
    { title: 'Revisar presupuesto mensual', priority: 'MEDIUM', category: 'Finanzas', dueDate: new Date(Date.now() + 86400000 * 7) },
    { title: 'Llamar al dentista', priority: 'HIGH', category: 'Salud', dueDate: new Date(Date.now() + 86400000) },
  ];

  for (const task of taskData) {
    await prisma.task.create({
      data: {
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        userId: user.id,
        categoryId: categories[task.category].id,
      },
    });
  }
  console.log(`  ✓ ${taskData.length} tareas creadas`);

  const habitData = [
    { name: 'Meditar 10 minutos', frequency: 'DAILY', category: 'Salud' },
    { name: 'Leer 20 páginas', frequency: 'DAILY', category: 'Estudios' },
    { name: 'Hacer ejercicio', frequency: 'WEEKLY', targetPerWeek: 3, category: 'Salud' },
    { name: 'Escribir en el diario', frequency: 'DAILY', category: 'Personal' },
  ];

  const habits = [];
  for (const habit of habitData) {
    const created = await prisma.habit.create({
      data: {
        name: habit.name,
        frequency: habit.frequency,
        targetPerWeek: habit.targetPerWeek,
        userId: user.id,
        categoryId: categories[habit.category].id,
      },
    });
    habits.push(created);
  }
  console.log(`  ✓ ${habitData.length} hábitos creados`);

  for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    if (daysAgo < 5) {
      await prisma.habitLog.create({
        data: { habitId: habits[0].id, date, completed: true },
      });
    }
    if (daysAgo < 3) {
      await prisma.habitLog.create({
        data: { habitId: habits[1].id, date, completed: true },
      });
    }
    if (daysAgo < 4) {
      await prisma.habitLog.create({
        data: { habitId: habits[3].id, date, completed: true },
      });
    }
  }

  await prisma.habit.update({
    where: { id: habits[0].id },
    data: { currentStreak: 5, longestStreak: 12 },
  });
  await prisma.habit.update({
    where: { id: habits[1].id },
    data: { currentStreak: 3, longestStreak: 8 },
  });
  await prisma.habit.update({
    where: { id: habits[3].id },
    data: { currentStreak: 4, longestStreak: 15 },
  });
  console.log('  ✓ Registros de hábitos y rachas calculadas');

  const goal1 = await prisma.goal.create({
    data: {
      title: 'Aprender Node.js avanzado',
      description: 'Completar curso avanzado de Node.js con proyectos prácticos',
      startDate: new Date(),
      targetDate: new Date(Date.now() + 86400000 * 90),
      status: 'ACTIVE',
      userId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      { goalId: goal1.id, title: 'Módulo 1: Streams y Buffers', status: 'COMPLETED', completedAt: new Date(), userId: user.id },
      { goalId: goal1.id, title: 'Módulo 2: Clusters y procesos hijo', status: 'COMPLETED', completedAt: new Date(), userId: user.id },
      { goalId: goal1.id, title: 'Módulo 3: APIs avanzadas', userId: user.id },
      { goalId: goal1.id, title: 'Módulo 4: Testing y debugging', userId: user.id },
      { goalId: goal1.id, title: 'Proyecto final', userId: user.id },
    ],
  });

  const goal2 = await prisma.goal.create({
    data: {
      title: 'Ponerse en forma',
      description: 'Ejercicio regular y alimentación saludable',
      startDate: new Date(),
      targetDate: new Date(Date.now() + 86400000 * 60),
      status: 'ACTIVE',
      userId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      { goalId: goal2.id, title: 'Correr 5k sin parar', status: 'COMPLETED', completedAt: new Date(), userId: user.id },
      { goalId: goal2.id, title: 'Hacer 50 flexiones seguidas', userId: user.id },
      { goalId: goal2.id, title: 'Reducir azúcar al mínimo', userId: user.id },
    ],
  });
  console.log('  ✓ 2 objetivos con tareas creadas');

  console.log('\n✅ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
