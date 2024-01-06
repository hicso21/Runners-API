import { Router } from 'express';
import PolarController from '../../../controllers/v1/Polar/polar.controllers.js';

const router = Router();

router.get('/authorize/:db_id', PolarController.authUser);
router.get('/exchange_token', PolarController.getExchangeToken);

router.get('/get_user/:db_id', PolarController.getRunnerData);
router.get('/get_daily_activity/:db_id', PolarController.getDailyActivity);
router.get('/get_runner_data/:db_id', PolarController.getTrainingData);
router.get('/get_physical_data/:db_id', PolarController.getPhysicalData);

export default router;
