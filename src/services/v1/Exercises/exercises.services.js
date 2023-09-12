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
            const newExercise = await new Exercises(exercise)
            await newExercise.save();
            return newExercise;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async updateExercise(id, exercise) {
        try {
            const exerciseUpdated = await Exercises.findByIdAndUpdate(id, exercise, { new: true });
            return exerciseUpdated;
        }catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async deleteExercise(id) {
        try {
            await Exercises.findByIdAndDelete(id);
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