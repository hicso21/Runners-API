import { Router } from 'express';
import RoutineNotificationsController from '../../../controllers/v1/RoutineNotifications/routinNotifications.controllers';

const router = Router();

router.post('/:user_id', RoutineNotificationsController.findOrCreate);
router.patch('/add/:user_id', RoutineNotificationsController.addNotification);
router.patch('/remove/:user_id',RoutineNotificationsController.eraseNotification);
router.get('/', RoutineNotificationsController.getAll);

export default router;
