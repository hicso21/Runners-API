import { Router } from 'express';
import multer from 'multer';
import GifsControllers from '../../../controllers/v1/Gifs/gifs.controllers.js';

const router = Router();

const upload = multer({ dest: '../../../Gifs' });

router.post('/gif', upload.single('gifFile'), GifsControllers.postGif);

router.get('/gif', GifsControllers.getAllGif);
router.get('/gif/:name', GifsControllers.getByName);
router.delete('/gif/:_id', GifsControllers.deleteGifById);

export default router;
