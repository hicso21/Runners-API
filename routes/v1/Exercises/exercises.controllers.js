import ExercisesServices from "./exercises.services.js";

class ExercisesControllers {
    
    static async getAllExercises(req, res) {
        try {
            const exercises = await ExercisesServices.getAllExercises();
            res.status(200).send(exercises);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async getExerciseById(req, res) {
        try {
            const { id } = req.params;
            const exercise = await ExercisesServices.getExerciseById(id);
            res.status(200).send(exercise);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async newExercise(req, res) {
        try {
            const exercise = req.body;
            const newExercise = await ExercisesServices.newExercise(exercise);
            res.status(201).send(newExercise);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async deleteExercise(req, res) {
        try {
            const { name } = req.body;
            const res = await ExercisesServices.deleteExercise(name);
            res.status(200).send(res);
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async updateExercise(req, res) {
        try {

        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

}


export default ExercisesControllers;