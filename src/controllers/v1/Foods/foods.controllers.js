import FoodsServices from '../../../services/v1/Foods/foods.services.js';

export default class FoodsControllers {
    static async getFoods(req, res) {
        try {
            const foods = await FoodsServices.getAllFoods();
            if (foods.error)
                return res
                    .status(400)
                    .send('An error has ocurred getting foods');
            res.send({
                error: false,
                data: foods,
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async createFood(req, res) {
        const body = req.body;
        try {
            if (!body.food) return res.send('The body have not food property');
            const newFood = await FoodsServices.createFood(body);
            if (newFood.error)
                return res
                    .status(400)
                    .send('An error has ocurred creating food');
            res.send({ error: false, data: newFood });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateFood(req, res) {
        const params = req.params;
        const body = req.body;
        try {
            if (!body.food || !params.id)
                return res.send('Missing property/ies');
            const updatedFood = await FoodsServices.updateFood(
                params.id,
                body.food
            );
            if (updatedFood.error)
                return res
                    .status(400)
                    .send('An error has ocurred creating food');
            res.send({ error: false, data: updatedFood });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async deleteFood(req, res) {
        const params = req.params;
        try {
            if (!params.id) return res.send("Id's missing");
            const deletedFood = await FoodsServices.deleteFood(params.id);
            res.send({ error: false, data: deletedFood });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }
}
