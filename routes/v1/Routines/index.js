import { Router } from "express";
import RoutinesController from "../../../controllers/v1/Routines/routines.controllers.js";

const router = Router();

router.get("/getAll", RoutinesController.getRoutines);
router.get("/getOne/:id", RoutinesController.getOneRoutine);
router.post("/create", RoutinesController.newRoutine);
router.put("/update/:id", RoutinesController.updateRoutine);
router.delete("/delete", RoutinesController.deleteRoutine);

export default router;