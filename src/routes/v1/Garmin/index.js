import { Router } from 'express';
import GarminController from '../../../controllers/v1/Garmin/garmin.controllers.js';
import Test from '../../../db/models/TestModel.js';

const router = Router();

router.get('/authorize/:db_id', GarminController.auth);
router.get('/exchange_token', GarminController.exchange);
router.post('/setStats', GarminController.setStats);
router.get('/get_stats', async (req, res) => {
	const body = req.body;
	await Test.create({ body: { ...body } });
	res.end();
});

export default router;
