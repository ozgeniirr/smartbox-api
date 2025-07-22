import { AppDataSource } from './config/data-source';
import app from './app';
import dotenv from 'dotenv';
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected');
    app.listen(3000, () => {
      console.log('🚀 Server listening on port 3000');
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });
