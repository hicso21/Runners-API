import { Router } from 'express';
import StravaControllers from '../../../controllers/v1/Strava/strava.controllers.js';
import refreshTokenMiddleWare from './middleware/refreshToken.js';

const router = Router();

router.get('/', (req, res) => {
	res.send('<h3>In this path, we have all the Strava requests</h3>');
});
router.get('/authorize/:db_id', StravaControllers.authorize);
router.get('/exchange_token/:db_id', StravaControllers.manageUserCode);
router.get(
	'/get_user/:id',
	refreshTokenMiddleWare,
	StravaControllers.getCompleteUser
);
router.get(
	'/get_user/:id/data',
	refreshTokenMiddleWare,
	StravaControllers.getData
);
router.get(
	'/get_user/:id/zones',
	refreshTokenMiddleWare,
	StravaControllers.getZones
);
router.get(
	'/get_user/:id/stats',
	refreshTokenMiddleWare,
	StravaControllers.getStats
);
router.get(
	'/get_user/:id/activities/:page',
	refreshTokenMiddleWare,
	StravaControllers.getActivities
);

export default router;
