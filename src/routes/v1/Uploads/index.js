import { Router } from 'express';
import GifsControllers from '../../../controllers/v1/Gifs/gifs.controllers.js';
import ImageControllers from '../../../controllers/v1/Images/images.controllers.js';

const router = Router();

router.post('/gif', GifsControllers.postGif);

router.get('/gif', GifsControllers.getAllGif);
router.get('/gif/:name', GifsControllers.getByName);
router.delete('/gif/:_id', GifsControllers.deleteGifById);

router.get('/img', ImageControllers.getAllImages);
router.get(`/img/:img_id`, ImageControllers.getImageById);
router.post('/img', ImageControllers.createImage);

export default router;
