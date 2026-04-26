import api from './api';

export async function getGoals() {
  const { data } = await api.get('/goals');
  return data;
}

export async function getGoal(id) {
  const { data } = await api.get(`/goals/${id}`);
  return data;
}

export async function createGoal(goal) {
  const { data } = await api.post('/goals', goal);
  return data;
}

export async function updateGoal(id, goal) {
  const { data } = await api.put(`/goals/${id}`, goal);
  return data;
}

export async function deleteGoal(id) {
  await api.delete(`/goals/${id}`);
}


