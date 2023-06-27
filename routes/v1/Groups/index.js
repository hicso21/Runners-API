import { Router } from "express";
import GroupsControllers from "../../../controllers/v1/Groups/groups.controllers.js";

const router = Router();

router.get("/getAll", GroupsControllers.getGroups);
router.get("/getOne/:id", GroupsControllers.getOneGroup);
router.post("/create", GroupsControllers.newGroup);
router.delete("/delete", GroupsControllers.deleteGroup);

export default router;