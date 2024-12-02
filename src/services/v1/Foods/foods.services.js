import Foods from '../../../db/models/Foods.js';

export default class FoodsServices {
    static async getAllFoods() {
        try {
            const foods = await Foods.find({});
            return foods;
        } catch (error) {
            return {
                data: error,
                error: true,
            };
        }
    }

    static async createFood(body) {
        try {
            const food = await Foods.create(body);
            return food;
        } catch (error) {
            return {
                data: error,
                error: true,
            };
        }
    }

    static async deleteFood(id) {
        try {
            const deletedFood = await Foods.findByIdAndDelete(id);
            return deletedFood;
        } catch (error) {
            return {
                data: error,
                error: true,
            };
        }
    }

    static async updateFood(id, food) {
        try {
            const updatedFood = await Foods.findByIdAndUpdate(id, {
                $set: { food },
            });
            return updatedFood;
        } catch (error) {
            return {
                data: error,
                error: true,
            };
        }
    }
}
