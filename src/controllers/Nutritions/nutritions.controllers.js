import Nutritions from '../../db/models/Nutrition.js';

export default class NutritionControllers {
    static async create(req, res) {
        const body = req.body;
        try {
            const nutrition = await Nutritions.create(body);

            res.send({
                error: false,
                data: nutrition,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async update(req, res) {
        const body = req.body;
        const { id } = req.params;
        try {
            const nutrition = await Nutritions.findByIdAndUpdate(id, body);

            res.send({
                error: false,
                data: nutrition,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const nutrition = await Nutritions.findById();

            res.send({
                error: false,
                data: nutrition,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getNutritions(req, res) {
        try {
            const nutritions = await Nutritions.find({});

            res.send({
                error: false,
                data: nutritions,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            await Nutritions.findByIdAndDelete(id);

            res.send({
                error: false,
                data: 'Deleted successfully',
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }
}
