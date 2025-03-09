import { Router } from 'express';
import PushNotificationsControllers from '../../../controllers/v1/PushNotifications/pushNotifications.controllers.js';

const router = Router();

router.get('/:user_id', PushNotificationsControllers.getTokenByUserId);
router.post('/', PushNotificationsControllers.createNotificationToken);

export default router;
