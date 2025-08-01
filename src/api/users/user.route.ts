import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { UserController } from './User.controller';

const router = Router();

const userController = new UserController();

router.get('/all', authenticateUser, userController.getAllUsers.bind(userController));
router.get('/profileMe', authenticateUser, userController.getProfileMe.bind(userController));




export default router;


