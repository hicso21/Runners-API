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
	'/:id',
	refreshTokenMiddleWare,
	StravaControllers.getCompleteUser
);
router.get(
	'/:id/data',
	refreshTokenMiddleWare,
	StravaControllers.getData
);
router.get(
	'/:id/zones',
	refreshTokenMiddleWare,
	StravaControllers.getZones
);
router.get(
	'/:id/activities/:page',
	refreshTokenMiddleWare,
	StravaControllers.getActivities
);
router.post(
	'/setStats',
	refreshTokenMiddleWare,
	StravaControllers.setStats
);

export default router;
