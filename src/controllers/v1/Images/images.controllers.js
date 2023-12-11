import Images from '../../../db/models/Image.js';

class ImageControllers {
	static async createImage(req, res) {
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
	}

	static async getImageById(req, res) {
		const { img_id } = req.params;
		const img = await Images.findById(img_id);
		res.send(img.img);
	}

	static async getAllImages(req, res) {
		const img = await Images.find({});
		res.send(img);
	}

	static async deleteImage(req, res) {
		const { img_id } = req.params;
		const img = await Images.findByIdAndDelete(img_id);
	}
}

export default ImageControllers;
