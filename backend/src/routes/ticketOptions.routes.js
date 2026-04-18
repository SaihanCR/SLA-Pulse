import express from "express";
import ticketOptionsController from "../controllers/ticketOptions.controller.js";

const router = express.Router();

// Endpoint final:
// GET /api/ticket-options/options
router.get("/options", ticketOptionsController.getOptions);

export default router;