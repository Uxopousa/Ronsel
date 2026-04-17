import * as goalService from '../services/goal.service.js';

export async function list(req, res) {
  const goals = await goalService.list(req.userId);
  res.json(goals);
}

export async function getById(req, res) {
  const goal = await goalService.getById(req.userId, req.params.id);
  res.json(goal);
}

export async function create(req, res) {
  const goal = await goalService.create(req.userId, req.body);
  res.status(201).json(goal);
}

export async function update(req, res) {
  const goal = await goalService.update(req.userId, req.params.id, req.body);
  res.json(goal);
}

export async function remove(req, res) {
  await goalService.remove(req.userId, req.params.id);
  res.status(204).end();
}

export async function addMilestone(req, res) {
  const milestone = await goalService.addMilestone(
    req.userId,
    req.params.id,
    req.body
  );
  res.status(201).json(milestone);
}

export async function updateMilestone(req, res) {
  const milestone = await goalService.updateMilestone(
    req.userId,
    req.params.id,
    req.params.milestoneId,
    req.body
  );
  res.json(milestone);
}

export async function removeMilestone(req, res) {
  await goalService.removeMilestone(
    req.userId,
    req.params.id,
    req.params.milestoneId
  );
  res.status(204).end();
}
