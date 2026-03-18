import { Router } from "express";
import slasController from "../controllers/slas.controller.js";

const router = Router();

router.get("/", slasController.getAll);
router.get("/:id", slasController.getById);
router.post("/", slasController.create);
router.put("/:id", slasController.update);
router.delete("/:id", slasController.delete);

export default router;