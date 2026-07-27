export const BIWEEK_REF = new Date('2000-01-03');

export function habitShowsOnDate(habit, dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dow = d.getDay();
  const targetDate = new Date(dateStr + 'T00:00:00');
  const created = new Date(habit.createdAt);
  created.setHours(0, 0, 0, 0);
  if (targetDate < created) return false;
  if (habit.frequency === 'DAILY') return true;
  if (habit.frequency === 'WEEKLY') {
    if (!habit.daysOfWeek || !Array.isArray(habit.daysOfWeek)) return true;
    return habit.daysOfWeek.includes(dow);
  }
  if (habit.frequency === 'BIWEEKLY') {
    if (!habit.daysOfWeek || !habit.daysOfWeek.week1) return true;
    const weekParity = Math.floor((targetDate - BIWEEK_REF) / (7 * 86400000)) % 2;
    const weekKey = weekParity === 0 ? 'week1' : 'week2';
    const days = habit.daysOfWeek[weekKey];
    return Array.isArray(days) && days.includes(dow);
  }
  return false;
}

export function taskChipStyle(t, colorPriority) {
  if (t.status === 'COMPLETED') return { bg: 'bg-neutral-50 dark:bg-neutral-800', text: 'text-neutral-400 line-through' };
  if (colorPriority) {
    if (t.priority === 'HIGH') return { bg: 'bg-error-bg', text: 'text-error-text' };
    if (t.priority === 'MEDIUM') return { bg: 'bg-warning-bg', text: 'text-warning-text' };
    return { bg: 'bg-success-bg', text: 'text-success-text' };
  }
  return { bg: 'bg-brand-50 dark:bg-brand-950', text: 'text-brand-700 dark:text-brand-300' };
}
