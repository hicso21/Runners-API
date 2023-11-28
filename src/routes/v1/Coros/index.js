import { Router } from 'express';
import CorosController from '../../../controllers/v1/Coros/coros.controllers.js';
import refreshTokenMiddleWare from './middleware/refreshTokenMiddleware.js';

const router = Router();

router.get('/', (req, res) => {
	res.send('<h3>In this path, we have all the Coros requests</h3>');
});

router.get('/authorize/:db_id', CorosController.authorize);
router.get('/exchange_token', CorosController.manageUserCode);
router.get(
	'/user_data/:id',
	refreshTokenMiddleWare,
	CorosController.getCompleteUser
);
router.get(
	'/data_by_date/:id/data',
	refreshTokenMiddleWare,
	CorosController.getDataByDate
);
router.get(
	'/data_by_date/:id/data',
	refreshTokenMiddleWare,
	CorosController.getRestDataByDate
);

export default router;
