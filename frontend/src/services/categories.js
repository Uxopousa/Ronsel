import api from './api';

export async function getCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function createCategory(cat) {
  const { data } = await api.post('/categories', cat);
  return data;
}

export async function updateCategory(id, cat) {
  const { data } = await api.put(`/categories/${id}`, cat);
  return data;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
