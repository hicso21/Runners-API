import { Router } from 'express';
import StravaControllers from '../../../controllers/v1/Strava/strava.controllers.js';
import refreshTokenMiddleWare from './middleware/refreshToken.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('<h3>In this path, we have all the Strava requests</h3>');
});
router.get('/authorize/:db_id', StravaControllers.authorize);
router.get('/exchange_token/:db_id', StravaControllers.manageUserCode);
router.get('/:id', refreshTokenMiddleWare, StravaControllers.getCompleteUser);
router.get('/:id/data', refreshTokenMiddleWare, StravaControllers.getData);
router.get('/:id/zones', refreshTokenMiddleWare, StravaControllers.getZones);
router.get(
    '/:id/activities/:page',
    refreshTokenMiddleWare,
    StravaControllers.getActivities
);
router.post('/setStats', refreshTokenMiddleWare, StravaControllers.setStats);

router.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = 'delaf2023';
    // Parses the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Verifies that the mode and token sent are valid
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.json({ 'hub.challenge': challenge });
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});
router.post('/webhook', (req, res) => {
    console.log('webhook event received!', req.query, req.body);
    res.status(200).send('EVENT_RECEIVED');
});

export default router;
