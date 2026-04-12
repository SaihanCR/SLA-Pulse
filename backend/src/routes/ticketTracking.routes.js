import { Router } from "express";
import ticketTrackingController from "../controllers/ticketTracking.controller.js";

const router = Router();

router.get("/", ticketTrackingController.getAll);
router.get("/by-ticket", ticketTrackingController.getByTicket.bind(ticketTrackingController));
router.get("/:id", ticketTrackingController.getById);
router.post("/", ticketTrackingController.create);
router.put("/:id", ticketTrackingController.update);
router.delete("/:id", ticketTrackingController.delete);

export default router;