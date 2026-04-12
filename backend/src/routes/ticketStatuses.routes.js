import { Router } from "express";
import ticketStatusesController from "../controllers/ticketStatuses.controller.js";

const router = Router();

router.get("/", ticketStatusesController.getAll.bind(ticketStatusesController));
router.get("/:id", ticketStatusesController.getById.bind(ticketStatusesController));
router.post("/", ticketStatusesController.create.bind(ticketStatusesController));
router.put("/:id", ticketStatusesController.update.bind(ticketStatusesController));
router.delete("/:id", ticketStatusesController.delete.bind(ticketStatusesController));

export default router;