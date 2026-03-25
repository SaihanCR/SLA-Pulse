// routes/tickets.routes.js
import { Router } from 'express';
import ticketsController from '../controllers/tickets.controller.js';

const router = Router();

router.get('/',       ticketsController.getAll.bind(ticketsController));
router.get('/:id',    ticketsController.getById.bind(ticketsController));
router.post('/',      ticketsController.create.bind(ticketsController));
router.put('/:id',    ticketsController.update.bind(ticketsController));
router.delete('/:id', ticketsController.delete.bind(ticketsController));

export default router;