import { Router } from "express";
import polar from "./Polar/index.js";
import garmin from "./Garmin/index.js";
import coros from "./Coros/index.js";
import suunto from "./Suunto/index.js";
import strava from "./Strava/index.js";
import LoginController from "./login/login.controllers.js";
import GroupsController from "./Groups/groups.controllers.js";
import RoutinesController from "./Routines/routines.controllers.js";
import ExercisesController from "./Exercises/exercises.controllers.js";

const router = Router();

router.post("/login", LoginController.login);
//router.post("/register", LoginController.register)

/* Groups Routes */
router.get("/groups/getAll", GroupsController.getGroups);
router.get("/groups/getOne/:id", GroupsController.getOneGroup);
router.post("/groups/create", GroupsController.newGroup);
router.delete("/groups/delete", GroupsController.deleteGroup);

/* Routines Routes */
router.get("/routines/getAll", RoutinesController.getRoutines);
router.get("/routines/getOne/:id", RoutinesController.getOneRoutine);
router.post("/routines/create", RoutinesController.newRoutine);
router.delete("/routines/delete", RoutinesController.deleteRoutine);

/* Exercises Routes */
router.get("/exercises/getAll", ExercisesController.getAllExercises);
router.get("/exercises/getOne/:id", ExercisesController.getExerciseById);
router.post("/exercises/create", ExercisesController.newExercise);
router.delete("/exercises/delete", ExercisesController.deleteExercise);

router.use("/garmin", garmin);
router.use("/polar", polar);
router.use("/suunto", suunto);
router.use("/strava", strava);
router.use("/coros", coros);

export default router;