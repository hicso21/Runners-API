import { Router } from 'express';
import RunnersControllers from '../../../controllers/v1/Runners/runners.controllers.js';

const router = Router();

router.get('/getAll', RunnersControllers.getAll);
router.get('/getById/:id', RunnersControllers.getById);
router.post('/create', RunnersControllers.newRunner);
router.post('/login', RunnersControllers.login);
router.put('/update/:id', RunnersControllers.updateRunner);
router.delete('/delete/:id', RunnersControllers.deleteRunner);
router.put('/updateRoutine/:id', RunnersControllers.updateRoutine);

export default router;
