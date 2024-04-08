import { Router } from 'express';
import CalendarControllers from '../../../controllers/v1/Calendar/calendar.controllers.js';

const router = Router();

router.post('/createUserEvents', CalendarControllers.createEvent);
router.get('/getUserEvent/:id', CalendarControllers.getEvent);
router.get('/getUserEvents/:id', CalendarControllers.getUserEvents);
router.delete('/deleteUserEvents', CalendarControllers.deleteUserEvents);

export default router;
