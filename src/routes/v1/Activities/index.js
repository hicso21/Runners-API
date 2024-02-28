import { Router } from 'express';
import ActivitiesControllers from '../../../controllers/v1/Activities/activities.controllers.js';

const router = Router();

router.get('/getAll/:user_id', ActivitiesControllers.getAll);
router.post('/create', ActivitiesControllers.postActivity);
router.delete('/delete', ActivitiesControllers.deleteActivity);

export default router;
