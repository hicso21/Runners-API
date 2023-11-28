import { Router } from 'express';
import multer from 'multer';
import GifsControllers from '../../../controllers/v1/Gifs/gifs.controllers.js';

const router = Router();

router.post('/gif', GifsControllers.postGif);

router.get('/gif', GifsControllers.getAllGif);
router.get('/gif/:name', GifsControllers.getByName);
router.delete('/gif/:_id', GifsControllers.deleteGifById);

export default router;
