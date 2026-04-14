import { Router } from "express";
import alertsController from "../controllers/alerts.controller.js";

const router = Router();

router.post("/run", alertsController.runEngine.bind(alertsController));

router.get("/active", alertsController.getActive.bind(alertsController));
router.get("/", alertsController.getAll.bind(alertsController));

export default router;
