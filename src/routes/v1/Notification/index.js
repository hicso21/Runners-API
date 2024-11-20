import { Router } from 'express';
import NotificationsControllers from '../../../controllers/v1/Notifications/notifications.controllers.js';

const router = Router();

router.post('/:user_id', NotificationsControllers.findOrCreate);
router.patch('/add/:user_id', NotificationsControllers.addNotification);
router.patch('/remove/:user_id', NotificationsControllers.eraseNotification);
router.get('/', NotificationsControllers.getAll);

export default router;
