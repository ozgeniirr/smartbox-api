import express from 'express';
import authRoutes from './api/auth/auth.route';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

export default app;
