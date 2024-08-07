import { Router } from 'express';
import RunnersControllers from '../../../controllers/v1/Runners/runners.controllers.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';

const router = Router();

router.get('/getAll', RunnersControllers.getAll);
router.get('/getById/:id', RunnersControllers.getById);
router.get('/getByEmail/:email', RunnersControllers.getByEmail);
router.get('/getByBrandId/:brand_id', RunnersControllers.getByBrandId);
router.post(
    '/getRunnerByEmailAndPassword',
    RunnersControllers.getRunnerByEmailAndPassword
);
router.post('/register', RunnersControllers.register);
router.post('/login', RunnersControllers.login);
router.post('/resetPassword', RunnersControllers.resetPassword);
router.put('/update/:id', RunnersControllers.updateRunnerGroup);
router.put('/updateRunner/:id', RunnersControllers.updateRunner);
router.delete('/delete/:id', RunnersControllers.deleteRunner);
router.put('/updateRoutine/:id', RunnersControllers.updateRoutine);
router.put('/updateCalendar/:id', RunnersControllers.updateCalendar);
router.put('/routineCompleted', RunnersControllers.routineCompleted);

export default router;
