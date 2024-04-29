import UserCodes from '../../../db/models/UsersCode.js';

export default class CodesControllers {
    static async getAll(req, res) {
        try {
            const usercodes = await UserCodes.find({});
            res.send({ error: false, data: usercodes });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async create(req, res) {
        const body = req.body;
        try {
            const usercode = await UserCodes.create(body);
            res.send({ error: false, data: usercode });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getByEmail(req, res) {
        const { email } = req.params;
        try {
            const usercode = await UserCodes.findOne({ email });
            res.send({ error: false, data: usercode });
        } catch (error) {
            res.send({ error: true, data: error });
        }
    }

    static async getByCode(req, res) {
        const { code } = req.params;
        try {
            const usercode = await UserCodes.findOne({ code });
            res.send({ error: false, data: usercode });
        } catch (error) {
            res.send({ error: true, data: error });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            await UserCodes.findByIdAndDelete(id);
            res.send({
                error: false,
                data: 'The code was deleted successfully',
            });
        } catch (error) {
            res.send({ error: true, data: error });
        }
    }
}
