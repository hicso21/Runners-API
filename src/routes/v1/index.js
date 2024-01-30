import { Router } from 'express';
import UserChats from '../../db/models/UserChat.js';
import EmailServices from '../../services/v1/Email/email.services.js';
import LogsServices from '../../services/v1/Logs/logs.services.js';
import coros from './Coros/index.js';
import exercises from './Exercises/index.js';
import garmin from './Garmin/index.js';
import groups from './Groups/index.js';
import polar from './Polar/index.js';
import routines from './Routines/index.js';
import runners from './Runners/index.js';
import strava from './Strava/index.js';
import stripe from './Stripe/index.js';
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

router.get('/chats', async (req, res) => {
	const chats = await UserChats.find({});
	res.status(200).send(chats);
});

router.get('/logs', async (req, res) => {
	const logs = await LogsServices.getAll();
	if (logs.error) return res.send('An error has ocurred');
	res.status(200).send(logs.data.sort((a, b) => b.createdAt - a.createdAt));
});

router.get('/email', (req, res) => {
	EmailServices.sendEmail(
		'hicso.dev@gmail.com',
		'Cambio de contraseña',
		'Esto es una prueba de testeo'
	);
	res.end();
});

router.use('/stripe', stripe);

export default router;
