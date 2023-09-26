import { Router } from 'express';
import CorosController from '../../../controllers/v1/Coros/coros.controllers.js';
import refreshTokenMiddleWare from './middleware/refreshTokenMiddleware.js';

const router = Router();

router.get('/', (req, res) => {
	res.send('<h3>In this path, we have all the Coros requests</h3>');
});

router.get('/authorize/:db_id', CorosController.authorize);
router.get('/', CorosController.manageUserCode);
router.get(
	'/get_user/:id',
	refreshTokenMiddleWare,
	CorosController.getCompleteUser
);
router.get(
	'/get_user/:id/data',
	refreshTokenMiddleWare,
	CorosController.getData
);
router.get(
	'/get_user/:id/zones',
	refreshTokenMiddleWare,
	CorosController.getZones
);
router.get(
	'/get_user/:id/stats',
	refreshTokenMiddleWare,
	CorosController.getStats
);
router.get(
	'/get_user/:id/activities/:page',
	refreshTokenMiddleWare,
	CorosController.getActivities
);

export default router;
