import { Router } from 'express';
import StripeControllers from '../../../controllers/v1/Stripe/stripe.controllers.js';

const router = Router();

router.get('/', StripeControllers.getPrices);

export default router;
