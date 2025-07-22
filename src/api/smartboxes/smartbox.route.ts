import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { SmartboxController } from './Smartbox.controller';
import { authorizeRole } from '@/middlewares/authorizeRole';

const router = Router();

const smartboxController = new SmartboxController();
router.post("/",authenticateUser,authorizeRole("admin"), smartboxController.create.bind(smartboxController));


export default router;


