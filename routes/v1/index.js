import { Router } from "express";
import polar from "./Polar/index.js";
import garmin from "./Garmin/index.js";
import coros from "./Coros/index.js";
import suunto from "./Suunto/index.js";
import strava from "./Strava/index.js";
import LoginController from "./login/login.controllers.js";
import GroupsController from "./Groups/groups.controllers.js";

const router = Router();

router.post("/login", LoginController.login);
//router.post("/register", LoginController.register)
router.get("/groups/getAll", GroupsController.getGroups);
router.get("/groups/getOne/:id", GroupsController.getOneGroup);
router.post("/groups/create", GroupsController.newGroup);
router.delete("/groups/delete/:id", GroupsController.deleteGroup);
router.use("/garmin", garmin);
router.use("/polar", polar);
router.use("/suunto", suunto);
router.use("/strava", strava);
router.use("/coros", coros);

export default router;