import { Router } from 'express';
import Food from '../../../db/models/Foods.js';
import FoodsControllers from '../../../controllers/v1/Foods/foods.controllers.js';

const router = Router();

router.get('/', FoodsControllers.getFoods);
router.post('/', FoodsControllers.createFood);
router.patch('/:id', FoodsControllers.updateFood);
router.delete('/:id', FoodsControllers.deleteFood);

export default router;
