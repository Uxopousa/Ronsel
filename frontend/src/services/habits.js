import api from './api';

export async function getHabits() {
  const { data } = await api.get('/habits');
  return data;
}

export async function getHabit(id) {
  const { data } = await api.get(`/habits/${id}`);
  return data;
}

export async function createHabit(habit) {
  const { data } = await api.post('/habits', habit);
  return data;
}

export async function updateHabit(id, habit) {
  const { data } = await api.put(`/habits/${id}`, habit);
  return data;
}

export async function deleteHabit(id) {
  await api.delete(`/habits/${id}`);
}

export async function toggleHabit(id, date) {
  const { data } = await api.post(`/habits/${id}/toggle`, { date: date || undefined });
  return data;
}

export async function getHabitCalendar(id, year, month) {
  const { data } = await api.get(`/habits/${id}/calendar`, {
    params: { year, month },
  });
  return data;
}
