import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/kpis", dashboardController.getDashboardKpis);
router.get("/charts", dashboardController.getDashboardCharts);
router.get("/alerts", dashboardController.getDashboardAlerts);
router.get("/overview", dashboardController.getDashboardOverview);

export default router;