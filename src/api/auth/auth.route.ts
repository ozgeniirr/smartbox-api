import { Router } from 'express';
import { AuthController } from './Auth.controller';
import { authenticateUser } from '@/middlewares/authenticateUser';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post("/login", authController.login.bind(authController) );
router.post('/verifyOtp', authController.verifyOTP.bind(authController));
export default router;
