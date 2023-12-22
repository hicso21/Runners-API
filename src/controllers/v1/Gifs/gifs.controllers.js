import Gifs from '../../../db/models/Gifs.js';
import GifsServices from '../../../services/v1/Gifs/gifs.services.js';

class GifsControllers {
	static async getByName(req, res) {
		try {
			const { name } = req.params;
			const gif = await GifsServices.byName(name);
			res.send(gif);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getAllGif(req, res) {
		try {
			const gifs = await GifsServices.allGif();
			res.send(gifs);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async deleteGifById(req, res) {
		try {
			const { _id } = req.params;
			const gif = await GifsServices.eraseGifById(_id);
			res.send({
				error: false,
				data: gif,
			});
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async postGif(req, res) {
		try {
			const { name, gifData } = req.body;
			if (name && gifData) {
				const gif = await Gifs.where({ name }).findOne();
				if (gif.name == name)
					return res.send({
						error: true,
						msg: 'Another gif with this name exist',
					});
				const newGif = new Gifs({
					name,
					gif: gifData,
				});

				newGif
					.save()
					.then((e) => {
						res.send({
							error: false,
							msg: 'File uploaded and saved to MongoDB',
							data: newGif,
						});
					})
					.catch((error) => {
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
	}
}

export default GifsControllers;
