import BaseRepository from './baseRepository.js';

class TicketTrackingRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla ticket_tracking
    super('ticket_tracking', 'tracking_id');
  }
}

export default new TicketTrackingRepository();