import { Router } from 'express';
import SuuntoController from '../../../controllers/v1/Suunto/suunto.controllers.js';

const router = Router();

router.get('/', (req, res) => {
	res.send('<h3>In this path, we have all the Suunto requests</h3>');
});

router.get('/authorize/:db_id', SuuntoController.auth);
router.get('/exchange_token/:db_id', SuuntoController.getToken);

router.get('/daily_activity/:db_id', SuuntoController.getActivitySamples);
router.get('/daily_statistics/:db_id', SuuntoController.getActivityStatistics);
router.get('/sleep_data/:db_id', SuuntoController.getSleepData);
router.get('/getStats', SuuntoController.getStats)

export default router;
