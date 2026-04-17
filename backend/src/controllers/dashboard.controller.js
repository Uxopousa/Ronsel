import * as dashboardService from '../services/dashboard.service.js';

export async function getDashboard(req, res) {
  const data = await dashboardService.getDashboard(req.userId);
  res.json(data);
}
