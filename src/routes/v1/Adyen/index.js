import { Router } from 'express';
import AdyenControllers from '../../../controllers/v1/Adyen/adyen.controllers.js';

const router = Router();

router.post('/makePayment', AdyenControllers.makePayment);
router.post('/getPending', AdyenControllers.webhook);

export default router;
