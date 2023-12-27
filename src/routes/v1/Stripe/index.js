import { Router } from 'express';
import StripeControllers from '../../../controllers/v1/Stripe/stripe.controllers.js';

const router = Router();

router.get('/prices', StripeControllers.getPrices);
router.get('/customers', StripeControllers.getCustomers);
router.post('/payment-sheet', StripeControllers.paymentSheet);
router.post('/checkout', StripeControllers.checkout);

export default router;
