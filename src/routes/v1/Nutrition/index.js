import { Router } from 'express';
import NutritionControllers from '../../../controllers/Nutritions/nutritions.controllers';

const router = Router();

router.get('/', NutritionControllers.getNutritions);
router.get('/:id', NutritionControllers.getById);
router.post('/', NutritionControllers.create);
router.delete('/:id', NutritionControllers.delete)

export default router;
