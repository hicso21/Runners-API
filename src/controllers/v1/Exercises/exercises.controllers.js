import ExercisesServices from "../../../services/v1/Exercises/exercises.services.js";

class ExercisesControllers {
    
    static async getAllExercises(req, res) {
        try {
            const exercises = await ExercisesServices.getAllExercises();
            res.status(200).send(exercises);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error
            });
        }
    }

    static async getExerciseById(req, res) {
        try {
            const { id } = req.params;
            const exercise = await ExercisesServices.getExerciseById(id);
            res.status(200).send(exercise);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error
            });
        }
    }

    static async newExercise(req, res) {
        try {
            const exercise = req.body;
            const newExercise = await ExercisesServices.newExercise(exercise);
            res.status(201).send(newExercise);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error
            });
        }
    }
    
    static async updateExercise(req, res) {
        try {
            const exercise = req.body;
            const { id } = req.params;
            const updateExercise = await ExercisesServices.updateExercise(id, exercise);
            res.status(200).send(updateExercise);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error
            });
        }
    }

    static async deleteExercise(req, res) {
        try {
            const { id } = req.params;
            const res = await ExercisesServices.deleteExercise(id);
            res.status(200).send(res);
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error
            });
        }
    }

}


export default ExercisesControllers;