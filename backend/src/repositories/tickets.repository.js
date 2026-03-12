import BaseRepository from './baseRepository.js';

class TicketsRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla tickets
    super('tickets', 'ticket_id');
  }
}

export default new TicketsRepository();