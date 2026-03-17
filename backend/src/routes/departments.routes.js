// routes/departments.routes.js
import { Router } from 'express';
import departmentsController from '../controllers/departments.controller.js';

const router = Router();

router.get('/',       departmentsController.getAll.bind(departmentsController));
router.get('/:id',    departmentsController.getById.bind(departmentsController));
router.post('/',      departmentsController.create.bind(departmentsController));
router.put('/:id',    departmentsController.update.bind(departmentsController));
router.delete('/:id', departmentsController.delete.bind(departmentsController));

export default router;