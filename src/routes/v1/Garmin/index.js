import { Router } from 'express';
import GarminController from '../../../controllers/v1/Garmin/garmin.controllers.js';
import Test from '../../../db/models/TestModel.js';

const router = Router();

router.get('/authorize/:db_id', GarminController.auth);
router.get('/exchange_token', GarminController.exchange);

router.post('/setStats', GarminController.setStats);

router.post('/get_stats_activities', GarminController.activitiesWebhook);

export default router;
