import Gifs from '../../../db/models/Gifs.js';

class GifsServices {
    static async allGif() {
        try {
            const gifs = await Gifs.find({});
            return gifs;
        } catch (error) {
            console.log(error);
            return {
                error: true,
                data: error,
            };
        }
    }

    static async gifsById(id_list) {
        try {
            return await Gifs.find({ _id: { $in: id_list } });
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getAllGifWithoutGif() {
        try {
            return await Gifs.find({}, '-gif');
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

    static async byId(id) {
        try {
            const gif = await Gifs.findById(id, 'gif');
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
