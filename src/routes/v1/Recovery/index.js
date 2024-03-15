import { Router } from 'express';
import RecoveryController from '../../../controllers/v1/Recovery/recovery.controllers.js';

const router = Router();

router.post('/verifyCode', RecoveryController.verifyCode);

export default router;
