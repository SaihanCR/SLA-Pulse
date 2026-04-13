import { Router } from 'express';
import ticketsController from '../controllers/tickets.controller.js';

const router = Router();

router.get('/', ticketsController.getAll.bind(ticketsController));
router.get('/search', ticketsController.search.bind(ticketsController));
router.get('/by-company', ticketsController.getByCompany.bind(ticketsController));
router.get('/by-status', ticketsController.getByStatus.bind(ticketsController));
router.get('/by-priority', ticketsController.getByPriority.bind(ticketsController));
router.get(
  '/by-responsible-department',
  ticketsController.getByResponsibleDepartment.bind(ticketsController)
);
router.get(
  '/by-requester-department',
  ticketsController.getByRequesterDepartment.bind(ticketsController)
);
router.get('/:id/detail', ticketsController.getDetail.bind(ticketsController));
router.get('/:id', ticketsController.getById.bind(ticketsController));
router.post('/', ticketsController.create.bind(ticketsController));
router.put('/:id', ticketsController.update.bind(ticketsController));
router.delete('/:id', ticketsController.delete.bind(ticketsController));

export default router;