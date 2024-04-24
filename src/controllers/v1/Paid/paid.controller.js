import Paids from '../../../db/models/Paid';

export default class PaidControllers {
    static async getAll(req, res) {
        try {
            const paids = await Paids.find({});
            res.send({ error: false, data: paids });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getOne(req, res) {
        const { paid_id } = req.params;
        try {
            const paid = await Paids.findById(paid_id);
            res.send({ error: false, data: paid });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getByUserId(req, res) {
        const { user_id } = req.params;
        try {
            const paid = await Paids.find({ user_id: user_id });
            res.send({ error: false, data: paid });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async create(req, res) {
        const { user_id } = req.body;
        try {
            const paid = await Paids.create({ user_id });
            res.send({ error: false, data: paid });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }
}
