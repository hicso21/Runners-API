import { Router } from "express";
import GroupsControllers from "../../../controllers/v1/Groups/groups.controllers.js";

const router = Router();

router.get("/groups/getAll", GroupsControllers.getGroups);
router.get("/groups/getOne/:id", GroupsControllers.getOneGroup);
router.post("/groups/create", GroupsControllers.newGroup);
router.delete("/groups/delete", GroupsControllers.deleteGroup);

export default router;