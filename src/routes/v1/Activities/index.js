import { Router } from 'express';
import ActivitiesControllers from '../../../controllers/v1/Activities/activities.controllers.js';

const router = Router();

router.get('/getAll/:user_id', ActivitiesControllers.getAll);
router.get(
    '/getAllWithoutArray/:user_id',
    ActivitiesControllers.getAllWithoutArray
);
router.get('/aggregated/:user_id', ActivitiesControllers.getAggregated);
router.get('/getById/:activity_id', ActivitiesControllers.getById);
router.post('/create', ActivitiesControllers.postActivity);
router.delete('/delete', ActivitiesControllers.deleteActivity);

export default router;
