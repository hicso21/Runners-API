import { Router } from 'express';
import NutritionControllers from '../../../controllers/v1/Nutritions/nutritions.controllers.js';

const router = Router();

router.get('/', NutritionControllers.getNutritions);
router.get('/:id', NutritionControllers.getById);
router.post('/', NutritionControllers.create);
router.put('/:id', NutritionControllers.update);
router.delete('/:id', NutritionControllers.delete);

export default router;
