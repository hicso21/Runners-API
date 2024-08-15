import { Router } from 'express';
import BrevoControllers from '../../../controllers/v1/Brevo/brevo.controllers.js';

const router = Router();

router.post('/recoveryPasswordMail', BrevoControllers.recoveryPasswordMail);
router.post('/createContact', BrevoControllers.createContact);
router.get('/api-key', (req, res) => {
    console.log(process.env.brevo_api_key);
    res.end();
});

export default router;
