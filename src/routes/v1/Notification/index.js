import { Router } from 'express';
import NotificationsControllers from '../../../controllers/v1/Notifications/notifications.controllers.js';

const router = Router();

router.get('/:user_id', NotificationsControllers.findOrCreate);
router.get('/add/:user_id', NotificationsControllers.addNotification);
router.get('/remove/:user_id', NotificationsControllers.eraseNotification);
router.get('/', NotificationsControllers.getAll);

export default router;
