import express from 'express';
import authRoutes from './api/auth/auth.route';
import packageRoutes from "./api/packages/package.route"
import smartboxRoutes from "./api/smartboxes/smartbox.route"
import userRoutes from "./api/users/user.route"
import emailRoutes from './api/email/email.routes'
import path from "path";
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/auth', authRoutes);
app.use("/package", packageRoutes);
app.use("/smartbox", smartboxRoutes);
app.use('/users', userRoutes);
app.use('/email', emailRoutes);
app.get('/pid', (req, res) => {
  res.send(`🧠 Yanıt veren PID: ${process.pid}`);
});
// app.ts içine bu kodu PID endpoint'inden önce ekle
let counter = 0;

app.use((req, res, next) => {
  counter++;
  console.log(`📥 PID: ${process.pid} | İstek: ${counter}`);
  next();
});
app.get("/", (req, res) => {
  res.send("API çalışıyor");
});


export default app;
