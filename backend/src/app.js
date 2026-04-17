import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
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

app.use(errorHandler);

export default app;
