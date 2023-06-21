import RunnersServices from "../../../services/v1/Runners/runners.services.js";

export default class RunnersControllers {

    static async getAll(req, res) {
        try {
            const runners = await RunnersServices.getAll();
            res.status(200).send(runners);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const runner = await RunnersServices.getById(id);
            res.status(200).send(runner);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async newRunner(req, res) {
        try {
            const data = req.body;
            const runner = await RunnersServices.create(data);
            res.status(201).send(runner);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async updateRunner(req, res) {
        try {
            const { name } = req.body;
            const data = req.body;
            const runner = await RunnersServices.update(name, data);
            res.status(200).send(runner);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

    static async deleteRunner(req, res) {
        try {
            const { name } = req.body;
            const runner = await RunnersServices.delete(name);
            res.status(200).send(runner);
        } catch (error) {
            res.status(404).send({
                error: true,
                data: error
            });
        }
    }

}