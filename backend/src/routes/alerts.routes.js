import { Router } from "express";
import alertsController from "../controllers/alerts.controller.js";

const router = Router();

router.post("/run", alertsController.runEngine.bind(alertsController));

export default router;