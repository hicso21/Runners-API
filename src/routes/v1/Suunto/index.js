import { Router } from 'express';
import SuuntoController from '../../../controllers/v1/Suunto/suunto.controllers.js';

const router = Router();

router.get('/', (req, res) => {
	res.send('<h3>In this path, we have all the Suunto requests</h3>');
});
router.get('/authorize/:db_id', SuuntoController.auth);
router.get('/exchange_token/:db_id', SuuntoController.getToken);

// router.use("/suunto", "");

export default router;
