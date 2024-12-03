import { Router } from 'express';
import RoutinesController from '../../../controllers/v1/Routines/routines.controllers.js';

const router = Router();

router.get('/getAll', RoutinesController.getRoutines);
router.get('/getOne/:id', RoutinesController.getOneRoutine);
router.post('/create', RoutinesController.newRoutine);
router.put('/update/:id', RoutinesController.updateRoutine);
router.patch('/updateName/:id', RoutinesController.updateRoutineName);
router.delete('/delete/:id', RoutinesController.deleteRoutine);

export default router;
