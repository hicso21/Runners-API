import { Router } from 'express';
import PaidControllers from '../../../controllers/v1/Paid/paid.controller';

const router = Router();

router.get('/', PaidControllers.getAll);
router.get('/:paid_id', PaidControllers.getOne);
router.get('/:user_id', PaidControllers.getByUserId);
router.post('/', PaidControllers.create);

export default router;
