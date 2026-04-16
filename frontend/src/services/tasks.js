import api from './api';

export async function getTasks(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, v);
  });
  const { data } = await api.get(`/tasks?${params}`);
  return data;
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
}

export async function createTask(task) {
  const { data } = await api.post('/tasks', task);
  return data;
}

export async function updateTask(id, task) {
  const { data } = await api.put(`/tasks/${id}`, task);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
