import RoutinesServices from "./routines.services.js";

class RoutinesController {

    static async getRoutines(req, res) {
        try {
            const routines = await RoutinesServices.getAllRoutines();
            res.status(200).send(routines);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async newRoutine(req, res) {
        try {
            const { name } = req.body;
            const newRoutine = await RoutinesServices.postRoutine(name);
            res.status(201).send(newRoutine);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async getOneRoutine(req, res) {
        try {
            const { id } = req.params;
            const routine = await RoutinesServices.getOneRoutine(id);
            res.status(200).send(routine)
        }catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async updateRoutine(req, res) {
        try {
            const { id } = req.params;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async deleteRoutine(req, res) {
        try {
            const { name } = req.body;
            const res = await RoutinesServices.deleteRoutine(name);
            res.status(200).send(res)
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

}

export default RoutinesController