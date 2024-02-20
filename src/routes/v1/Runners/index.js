import { Router } from 'express';
import RunnersControllers from '../../../controllers/v1/Runners/runners.controllers.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';

const router = Router();

router.get('/getAll', RunnersControllers.getAll);
router.get('/getById/:id', RunnersControllers.getById);
router.get('/getByEmail/:email', RunnersControllers.getByEmail);
router.post('/register', RunnersControllers.register);
router.post('/login', RunnersControllers.login);
router.post('/resetPassword', RunnersControllers.resetPassword);
router.post('/update/:id', RunnersControllers.updateRunner);
router.delete('/delete/:id', RunnersControllers.deleteRunner);
router.put('/updateRoutine/:id', RunnersControllers.updateRoutine);
router.put('/updateCalendar/:id', RunnersControllers.updateCalendar);

export default router;
