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

export async function addMilestone(goalId, milestone) {
  const { data } = await api.post(`/goals/${goalId}/milestones`, milestone);
  return data;
}

export async function updateMilestone(goalId, milestoneId, data) {
  const { data: res } = await api.put(`/goals/${goalId}/milestones/${milestoneId}`, data);
  return res;
}

export async function deleteMilestone(goalId, milestoneId) {
  await api.delete(`/goals/${goalId}/milestones/${milestoneId}`);
}
