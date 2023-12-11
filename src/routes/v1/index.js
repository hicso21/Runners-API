import { Router } from 'express';
import coros from './Coros/index.js';
import exercises from './Exercises/index.js';
import garmin from './Garmin/index.js';
import stripe from './Stripe/index.js';
import groups from './Groups/index.js';
import polar from './Polar/index.js';
import routines from './Routines/index.js';
import runners from './Runners/index.js';
import strava from './Strava/index.js';
import suunto from './Suunto/index.js';
import uploads from './Uploads/index.js';
import LoginController from './login/login.controllers.js';

const router = Router();

router.get('/', (req, res) => {
	res.send(req.href);
});

router.post('/login', LoginController.login);

router.use('/groups', groups);
router.use('/routines', routines);
router.use('/exercises', exercises);
router.use('/runners', runners);
router.use('/upload', uploads);

router.use('/coros', coros);
router.use('/suunto', suunto);
router.use('/strava', strava);
router.use('/polar', polar);
router.use('/garmin', garmin);

router.use('/stripe', stripe);

export default router;
