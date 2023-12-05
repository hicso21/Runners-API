import { Router } from 'express';
import GifsControllers from '../../../controllers/v1/Gifs/gifs.controllers.js';
import Images from '../../../db/models/Image.js';

const router = Router();

router.post('/gif', GifsControllers.postGif);

router.get('/gif', GifsControllers.getAllGif);
router.get('/gif/:name', GifsControllers.getByName);
router.delete('/gif/:_id', GifsControllers.deleteGifById);

router.get('/img', async (req, res) => {
	const img = await Images.find({});
	res.send(img);
});
router.get(`/img/:img_id`, async (req, res) => {
	const { img_id } = req.params;
	const img = await Images.findById(img_id);
	res.send(img.img);
});
router.post('/img', (req, res) => {
	try {
		const { name, imgData } = req.body;
		if (name && imgData) {
			const newImage = new Images({
				name,
				img: imgData,
			});

			newImage
				.save()
				.then((e) => {
					// File saved successfully
					res.send({
						error: false,
						msg: 'File uploaded and saved to MongoDB',
					});
				})
				.catch((error) => {
					// Error saving the file
					res.status(500).send({
						error: true,
						msg: 'Error saving the file to MongoDB',
					});
				});
		} else {
			// Invalid request
			res.status(400).send({ error: true, msg: 'Invalid request' });
		}
	} catch (error) {
		res.send({
			error: true,
			data: error,
		});
	}
});

export default router;
