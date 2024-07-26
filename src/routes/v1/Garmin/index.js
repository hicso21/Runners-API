import { Router } from 'express';
import GarminController from '../../../controllers/v1/Garmin/garmin.controllers.js';
import Test from '../../../db/models/TestModel.js';

const router = Router();

router.get('/authorize/:db_id', GarminController.auth);
router.get('/exchange_token', GarminController.exchange);
router.post('/setStats', GarminController.setStats);
router.get('/get_stats_activities', async (req, res) => {
    const body = req.body;
    console.log('This is the GET of get_stats_activities', body);
    await Test.create({ body: { ...body, webhook: 'activities' } });
    res.end();
});
router.post('/get_stats_activities', async (req, res) => {
    const body = req.body;
    console.log('This is the POST of get_stats_activities', body);
    await Test.create({ body: { ...body, webhook: 'activities' } });
    res.end();
});
router.get('/get_stats_activity_details', async (req, res) => {
    const body = req.body;
    console.log('This is the GET of get_stats_activity_details', body);
    await Test.create({ body: { ...body, webhook: 'activity_details' } });
    res.end();
});
router.post('/get_stats_activity_details', async (req, res) => {
    const body = req.body;
    console.log('This is the POST of get_stats_activity_details', body);
    await Test.create({ body: { ...body, webhook: 'activity_details' } });
    res.end();
});

export default router;
