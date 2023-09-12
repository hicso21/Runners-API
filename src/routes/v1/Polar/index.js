import { Router } from "express";
import PolarController from "../../../controllers/v1/Polar/polar.controllers.js";

const router = Router();

router.get("/oauth", async (req, res) => {
  // const { data } = await axios.get(`${polarData.oauth_endpoint}/oauth2/authorization?response_type=code&client_id=${polarData.client_id}&redirect_uri=${polarData.redirect_uri}`);
  // console.log(data)
  // res.send(data);
});

export default router