import * as devService from '../services/dev.service.js';

export async function seed(req, res) {
  const result = await devService.seed(req.userId);
  res.json({ message: 'Datos de ejemplo creados', created: result });
}

export async function wipe(req, res) {
  const result = await devService.wipe(req.userId);
  res.json({ message: 'Datos eliminados', deleted: result });
}
