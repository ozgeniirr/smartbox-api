import express from 'express';
import authRoutes from './api/auth/auth.route';
import packageRoutes from "./api/packages/package.route"
import smartboxRoutes from "./api/smartboxes/smartbox.route"
import userRoutes from "./api/users/user.route"
import emailRoutes from './api/email/email.routes'


const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use("/package", packageRoutes);
app.use("/smartbox", smartboxRoutes);
app.use('/users', userRoutes);
app.use('/email', emailRoutes);

export default app;
