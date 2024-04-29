import { Router } from 'express';
import CodesControllers from '../../../controllers/v1/Codes/codes.controllers.js';

const router = Router();

router.get('/', CodesControllers.getAll);
router.post('/', CodesControllers.create);
router.get('/getByEmail/:email', CodesControllers.getByEmail);
router.get('/getByCode/:code', CodesControllers.getByCode);
router.delete('/:id', CodesControllers.delete);

export default router;
