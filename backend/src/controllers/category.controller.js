import * as categoryService from '../services/category.service.js';

export async function list(req, res) {
  const categories = await categoryService.list(req.userId);
  res.json(categories);
}

export async function create(req, res) {
  const category = await categoryService.create(req.userId, req.body);
  res.status(201).json(category);
}

export async function update(req, res) {
  const category = await categoryService.update(req.userId, req.params.id, req.body);
  res.json(category);
}

export async function remove(req, res) {
  await categoryService.remove(req.userId, req.params.id);
  res.status(204).end();
}
