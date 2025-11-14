import { Router } from 'express';
import UserChats from '../../db/models/UserChat.js';
import LogsServices from '../../services/v1/Logs/logs.services.js';
import activities from './Activities/index.js';
import brevo from './Brevo/index.js';
import calendar from './Calendar/index.js';
import codes from './Codes/index.js';
import coros from './Coros/index.js';
import exercises from './Exercises/index.js';
import foods from './Foods/index.js';
import garmin from './Garmin/index.js';
import groups from './Groups/index.js';
import notifications from './Notification/index.js';
import nutritions from './Nutrition/index.js';
import paid from './Paid/index.js';
import payment from './Payment/index.js';
import polar from './Polar/index.js';
import pushNotifications from './PushNotifications/index.js';
import recovery from './Recovery/index.js';
import routineNotifications from './RoutineNotifications/index.js';
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

router.use('/activities', activities);
router.use('/brevo', brevo);
router.use('/calendar', calendar);
router.use('/codes', codes);
router.use('/exercises', exercises);
router.use('/foods', foods);
router.use('/groups', groups);
router.use('/notifications', notifications);
router.use('/nutritions', nutritions);
router.use('/paid', paid);
router.use('/push_notifications', pushNotifications);
router.use('/recovery', recovery);
router.use('/routine_notifications', routineNotifications);
router.use('/routines', routines);
router.use('/runners', runners);
router.use('/upload', uploads);

router.use('/coros', coros);
router.use('/garmin', garmin);
router.use('/polar', polar);
router.use('/strava', strava);
router.use('/suunto', suunto);

router.use('/payment', payment);

router.post('/mercadopago', (req, res) => {
    const data = req.body;
    console.log('Mercado Pago Data => ', data);
});

router.get('/chats', async (req, res) => {
    const chats = await UserChats.find({});
    res.status(200).send(chats);
});

router.get('/logs', async (req, res) => {
    const logs = await LogsServices.getAll();
    if (logs.error) return res.send('An error has ocurred');
    res.status(200).send(logs.data.sort((a, b) => b.createdAt - a.createdAt));
});

router.use('/stripe', stripe);

export default router;
