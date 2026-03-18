// routes/companies.routes.js
import { Router } from "express";
import companiesController from "../controllers/companies.controller.js";

const router = Router();

router.get("/", companiesController.getAll);
router.get("/:id", companiesController.getById);
router.post("/", companiesController.create);
router.put("/:id", companiesController.update);
router.delete("/:id", companiesController.delete);

export default router;