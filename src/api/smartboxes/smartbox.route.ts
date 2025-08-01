import { Router } from 'express';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { SmartboxController } from './Smartbox.controller';
import { authorizeRole } from '@/middlewares/authorizeRole';

const router = Router();

const smartboxController = new SmartboxController();
router.post("/", authenticateUser,authorizeRole("admin"), smartboxController.create.bind(smartboxController));
router.get("/all", authenticateUser, smartboxController.getAllSmartB.bind(smartboxController));
router.get("/:smartboxId", authenticateUser, smartboxController.getSmtBox.bind(smartboxController));
router.patch("/update/:smartboxId", authenticateUser, authorizeRole("admin"), smartboxController.updateSmartBx.bind(smartboxController));
router.delete("/delete/:smartboxId", authenticateUser, authorizeRole("admin"), smartboxController.deleteSmart.bind(smartboxController));



export default router;


