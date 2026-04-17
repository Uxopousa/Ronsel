import * as habitService from '../services/habit.service.js';

export async function list(req, res) {
  const habits = await habitService.list(req.userId);
  res.json(habits);
}

export async function getById(req, res) {
  const habit = await habitService.getById(req.userId, req.params.id);
  res.json(habit);
}

export async function create(req, res) {
  const habit = await habitService.create(req.userId, req.body);
  res.status(201).json(habit);
}

export async function update(req, res) {
  const habit = await habitService.update(req.userId, req.params.id, req.body);
  res.json(habit);
}

export async function remove(req, res) {
  await habitService.remove(req.userId, req.params.id);
  res.status(204).end();
}

export async function toggleLog(req, res) {
  const { date } = req.body;
  const result = await habitService.toggleLog(
    req.userId,
    req.params.id,
    date || new Date().toISOString()
  );
  res.json(result);
}

export async function getCalendar(req, res) {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const data = await habitService.getCalendar(req.userId, req.params.id, year, month);
  res.json(data);
}
