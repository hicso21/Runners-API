import { Router } from 'express';
import PaidControllers from '../../../controllers/v1/Paid/paid.controllers.js';

const router = Router();

router.get('/', PaidControllers.getAll);
router.get('/:paid_id', PaidControllers.getOne);
router.get('/getByUserId/:user_id', PaidControllers.getByUserId);
router.post('/', PaidControllers.create);

export default router;
