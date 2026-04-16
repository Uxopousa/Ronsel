import * as taskService from '../services/task.service.js';

export async function list(req, res) {
  const tasks = await taskService.list(req.userId, req.query);
  res.json(tasks);
}

export async function getById(req, res) {
  const task = await taskService.getById(req.userId, req.params.id);
  res.json(task);
}

export async function create(req, res) {
  const task = await taskService.create(req.userId, req.body);
  res.status(201).json(task);
}

export async function update(req, res) {
  const task = await taskService.update(req.userId, req.params.id, req.body);
  res.json(task);
}

export async function remove(req, res) {
  await taskService.remove(req.userId, req.params.id);
  res.status(204).end();
}
