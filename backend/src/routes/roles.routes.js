import {Router} from "express";
import rolesController from "../controllers/roles.controller.js";

const router = Router();

router.get('/',       rolesController.getAll.bind(rolesController));
router.get('/:id',    rolesController.getById.bind(rolesController));
router.post('/',      rolesController.create.bind(rolesController));
router.put('/:id',    rolesController.update.bind(rolesController));
router.delete('/:id', rolesController.delete.bind(rolesController));

export default router;