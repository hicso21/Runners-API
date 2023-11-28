import Gifs from '../../../db/models/Gifs.js';

class GifsServices {
	static async allGif() {
		try {
			const gifs = await Gifs.find({});
			return gifs;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async byName(name) {
		try {
			const gif = await Gifs.find({ $where: { name } });
			return gif;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async eraseGifById(id) {
		try {
			const gif = await Gifs.findByIdAndDelete(id);
			return gif;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default GifsServices;
