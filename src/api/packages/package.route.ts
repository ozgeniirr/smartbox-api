import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { PackageController } from './Package.controller';
import { authorizeRole } from '@/middlewares/authorizeRole';

const router = Router();

const packageController = new  PackageController();
router.post("/create/:userId" ,authenticateUser, authorizeRole("admin"), packageController.createPack.bind(packageController));
router.delete("/:packageId", authenticateUser, authorizeRole("admin"), packageController.deletePack.bind(packageController));
router.patch("/pick/:packageId", authenticateUser, packageController.pickPack.bind(packageController));
router.get("/me",authenticateUser, packageController.getUserPack.bind(packageController));
router.get("/me/qrCodes", authenticateUser, packageController.getUserPacksQr.bind(packageController));




export default router;


