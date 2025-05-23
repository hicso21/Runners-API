import RoutinesServices from '../../../services/v1/Routines/routines.services.js';

class RoutinesController {
    static async getRoutines(req, res) {
        try {
            const routines = await RoutinesServices.getAllRoutines();
            res.status(200).send(routines);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async newRoutine(req, res) {
        try {
            const { name, type } = req.body;
            const exercises = [];
            const newRoutine = await RoutinesServices.postRoutine(
                name,
                exercises,
                type
            );
            res.status(201).send(newRoutine);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async getOneRoutine(req, res) {
        try {
            const { id } = req.params;
            const routine = await RoutinesServices.getOneRoutine(id);
            res.status(200).send(routine);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateRoutineName(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedRoutine = await RoutinesServices.updateRoutineName(
                id,
                name
            );
            res.status(200).send(updatedRoutine);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateRoutine(req, res) {
        try {
            const { id } = req.params;
            const routine = req.body;
            const updatedRoutine = await RoutinesServices.updateRoutine(
                id,
                routine
            );
            res.status(200).send(updatedRoutine);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async deleteRoutine(req, res) {
        try {
            const { id } = req.params;
            await RoutinesServices.deleteRoutine(id);
            res.status(200).send({
                error: false,
                data: 'Routine deleted correctly',
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }
}

export default RoutinesController;
