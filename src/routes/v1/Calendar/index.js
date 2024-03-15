import { Router } from 'express';
import CalendarControllers from '../../../controllers/v1/Calendar/calendar.controllers.js';

const router = Router();

router.post('/createEvent', CalendarControllers.createEvent);
router.get('/getEvent', CalendarControllers.getEvent);
router.get('/getUserEvents', CalendarControllers.getUserEvents);

export default router;
