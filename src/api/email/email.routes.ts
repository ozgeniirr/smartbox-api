import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { OtpEmailController } from './Email.controller';

const router = Router();

const otpEmailController = new OtpEmailController();

router.post('/send', authenticateUser, otpEmailController.sendEmail.bind(otpEmailController))



export default router;


