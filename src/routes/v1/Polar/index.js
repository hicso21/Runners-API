import { Router } from "express";
import PolarController from "../../../controllers/v1/Polar/polar.controllers.js";

const router = Router();

router.get("/auth/:user_id", PolarController.authUser);

router.get("/exchange_token", )

export default router