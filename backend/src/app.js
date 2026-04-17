import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import categoryRoutes from './routes/category.routes.js';
import taskRoutes from './routes/task.routes.js';
import habitRoutes from './routes/habit.routes.js';
import goalRoutes from './routes/goal.routes.js';
import errorHandler from './middleware/error.middleware.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);

app.use(errorHandler);

export default app;
