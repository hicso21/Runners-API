import { Router } from 'express';
import PolarController from '../../../controllers/v1/Polar/polar.controllers.js';

const router = Router();

router.get('/auth/:user_id', PolarController.authUser);

router.get('/exchange_token', PolarController.getExchangeToken);

router.get('/get_user/:user_id', PolarController.getRunnerData);

router.get('/get_daily_activity/:user_id', PolarController.getDailyActivity);

export default router;
