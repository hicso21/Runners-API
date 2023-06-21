import { Router } from "express";
import RunnersControllers from "../../../controllers/v1/Runners/runners.controllers.js";

const router = Router();

router.get("/getAll", RunnersControllers.getAll);
router.get("/getById/:id", RunnersControllers.getById);
router.post("/create", RunnersControllers.newRunner);
router.put("/update", RunnersControllers.updateRunner);
router.delete("/delete", RunnersControllers.deleteRunner);

export default router;