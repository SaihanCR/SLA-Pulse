import BaseRepository from './baseRepository.js';

class TicketStatusesRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla ticket_statuses
    super('ticket_statuses', 'status_id');
  }
}

export default new TicketStatusesRepository();