import { Router } from "express";
import ExercisesControllers from "../../../controllers/v1/Exercises/exercises.controllers.js";

const router = Router();

router.get("/getAll", ExercisesControllers.getAllExercises);
router.get("/getOne/:id", ExercisesControllers.getExerciseById);
router.post("/create", ExercisesControllers.newExercise);
router.delete("/delete/:id", ExercisesControllers.deleteExercise);

export default router