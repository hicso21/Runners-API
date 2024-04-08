import { Router } from 'express';
import CalendarControllers from '../../../controllers/v1/Calendar/calendar.controllers.js';

const router = Router();

router.post('/createEvent', CalendarControllers.createEvent);
router.get('/getEvent/:id', CalendarControllers.getEvent);
router.get('/getUserEvents/:id', CalendarControllers.getUserEvents);
router.delete('/deleteUserEvents', CalendarControllers.deleteUserEvents);

export default router;
