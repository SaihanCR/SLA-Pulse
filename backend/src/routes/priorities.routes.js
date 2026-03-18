import { Router } from 'express';
import prioritiesController from '../controllers/priorities.controller.js';

const router = Router();

router.get('/',       prioritiesController.getAll.bind(prioritiesController));
router.get('/:id',    prioritiesController.getById.bind(prioritiesController));
router.post('/',      prioritiesController.create.bind(prioritiesController));
router.put('/:id',    prioritiesController.update.bind(prioritiesController));
router.delete('/:id', prioritiesController.delete.bind(prioritiesController));

export default router;