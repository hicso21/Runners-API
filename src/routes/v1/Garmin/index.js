import { Router } from 'express';
import GarminController from '../../../controllers/v1/Garmin/garmin.controllers.js';
import Test from '../../../db/models/TestModel.js';

const router = Router();

router.get('/authorize/:db_id', GarminController.auth);
router.get('/exchange_token', GarminController.exchange);

router.post('/setStats', GarminController.setStats);

router.post('/get_stats_activities', GarminController.activitiesWebhook);
router.post('/get_hrv_summary', GarminController.getHrvSummary);
router.post('/get_stats_activity_details', GarminController.getStatsActivityDetails);
router.post('/get_move_iq', GarminController.getMoveIQ);

export default router;
