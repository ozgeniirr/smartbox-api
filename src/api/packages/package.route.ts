import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { PackageController } from './Package.controller';
import { authorizeRole } from '@/middlewares/authorizeRole';

const router = Router();

const packageController = new PackageController();
router.post("/create/:senderId" ,authenticateUser, authorizeRole("admin"), packageController.createPack.bind(packageController));
router.delete("/:packageId", authenticateUser, authorizeRole("admin"), packageController.deletePack.bind(packageController));





export default router;


