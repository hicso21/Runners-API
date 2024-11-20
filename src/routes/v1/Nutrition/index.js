import { Router } from 'express';
import NutritionControllers from '../../../controllers/v1/Nutritions/nutritions.controllers.js';

const router = Router();

router.get('/', NutritionControllers.getNutritions);
router.post('/', NutritionControllers.create);
router.get('/:id', NutritionControllers.getById);
router.put('/:id', NutritionControllers.update);
router.delete('/:id', NutritionControllers.delete);

export default router;
