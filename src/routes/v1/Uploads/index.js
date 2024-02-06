import { Router } from 'express';
import GifsControllers from '../../../controllers/v1/Gifs/gifs.controllers.js';
import ImageControllers from '../../../controllers/v1/Images/images.controllers.js';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import multer from 'multer';
import mongoose from 'mongoose';
import MultimediaController from '../../../controllers/v1/Multimedia/multimedia.controllers.js';

const mongoURI =
	'mongodb+srv://hicso:thomas2110@runnersdb.kso8gvp.mongodb.net/?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
});

const storage = new GridFsStorage({
	url: mongoURI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				console.log(file);
				const filename = file.originalname;
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads',
				};
				resolve(fileInfo);
			});
		});
	},
});
const upload = multer({ storage });

const router = Router();

/* GIF */
router.get('/gif', GifsControllers.getAllGif);
router.get('/gif/just_names', GifsControllers.justNameGif);
router.get('/gif/:name', GifsControllers.getByName);
router.post('/gif/id_list', GifsControllers.byIdList);
router.post('/gif', GifsControllers.postGif);
router.delete('/gif/:_id', GifsControllers.deleteGifById);

/* IMAGE */
router.get('/img', ImageControllers.getAllImages);
router.get(`/img/:img_id`, ImageControllers.getImageById);

router.post('/img', ImageControllers.createImage);

/* Multimedia */
router.get('/multimedia', MultimediaController.getAll);

/* Videos */
router.get('/multimedia/getVideos', MultimediaController.getVideos);
router.post('/multimedia/postVideos', MultimediaController.postVideo);

/* Audios */
router.get('/multimedia/getAudios', MultimediaController.getAudios);
router.post('/multimedia/postAudios', MultimediaController.postAudio);

/* Texts */
router.get('/multimedia/getTexts', MultimediaController.getTexts);
router.post('/multimedia/postTexts', MultimediaController.postText);

/* Tips */
router.get('/multimedia/getTips', MultimediaController.getTips);
router.post('/multimedia/postTips', MultimediaController.postTip);

// router.post('/multimedia', upload.single('file'), MultimediaController.upload);
router.delete('/multimedia/:id', MultimediaController.delete);

export default router;
