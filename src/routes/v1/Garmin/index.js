import { Router } from 'express';
import GarminController from '../../../controllers/v1/Garmin/garmin.controllers.js';

const router = Router();

router.get('/authorize/:db_id', GarminController.auth);
router.get('/exchange_token', GarminController.exchange);

router.post('/setStats', GarminController.setStats);

router.post('/get_stats_activity_details', GarminController.getStatsActivityDetails);

export default router;
