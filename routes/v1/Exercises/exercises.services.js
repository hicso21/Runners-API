import Exercises from "../../../db/models/Exercises.js";

class ExercisesServices {
    static async getAllExercises() {
        try {
            const exercises = await Exercises.find({});
            return exercises;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async getExerciseById(id) {
        try {
            const exercise = await Exercises.findById(id);
            return exercise;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async newExercise(exercise) {
        try {
            const newExercise = await new Exercises(exercise).save();
            return newExercise;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async updateExercise(exercise) {
        try {
            
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async deleteExercise(name) {
        try {
            await Exercises.deleteOne({ name: name });
            return {
                error: false
            }
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }
}

export default ExercisesServices;