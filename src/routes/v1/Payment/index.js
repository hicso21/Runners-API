import { Router } from 'express';
import PaymentControllers from '../../../controllers/v1/Payment/payment.controllers.js';

const router = Router();

router.get('/getPublishableKey', PaymentControllers.getPublishableKey)
router.get('/getTestPublishableKey', PaymentControllers.getTestPublishableKey)
// router.post('/getToken', PaymentControllers.getToken);
// router.post('/checkout', PaymentControllers.checkout);

export default router;
