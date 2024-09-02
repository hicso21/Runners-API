import Gifs from '../../../db/models/Gifs.js';
import GifsServices from '../../../services/v1/Gifs/gifs.services.js';

class GifsControllers {
    static async getByName(req, res) {
        const { name } = req.params;
        try {
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
        const { without } = req.query;
        let gifs;
        try {
            if (without === 'gif')
                gifs = await GifsServices.getAllGifWithoutGif();
            if (!without) gifs = await GifsServices.allGif();
            res.send(gifs);
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async deleteGifById(req, res) {
        const { _id } = req.params;
        try {
            const gif = await GifsServices.eraseGifById(_id);
            res.send(gif);
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async postGif(req, res) {
        const body = req.body;
		console.log(body)
        try {
            if (
                Array.isArray(body) &&
                body.every((item) => item.name && item.gifData)
            ) {
                const alreadyExistGif = await Gifs.find({ name: name });
                if (alreadyExistGif.length)
                    return res.send({
                        error: true,
                        msg: 'Another gif with this name exist',
                    });
                const newGif = new Gifs(body);
                newGif
                    .save()
                    .then((gif) => {
                        // File saved successfully
                        res.send({
                            error: false,
                            msg: 'File uploaded and saved to MongoDB',
                            data: gif,
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

    static async justNameGif(req, res) {
        try {
            const gifs = await GifsServices.allGif();
            res.send({
                error: false,
                data: gifs,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async byIdList(req, res) {
        const list = req.body;
        try {
            const gifs = await GifsServices.gifsById(list);
            res.send({
                error: false,
                data: gifs,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }
}

export default GifsControllers;
