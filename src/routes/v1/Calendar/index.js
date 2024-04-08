import { Router } from 'express';
import CalendarControllers from '../../../controllers/v1/Calendar/calendar.controllers.js';

const router = Router();

router.post('/createUserEvents', CalendarControllers.createUserEvents);
router.get('/getUserEvent/:id', CalendarControllers.getUserEvent);
router.get('/getUserEvents/:id', CalendarControllers.getUserEvents);
router.delete('/deleteUserEvents', CalendarControllers.deleteUserEvents);

export default router;
