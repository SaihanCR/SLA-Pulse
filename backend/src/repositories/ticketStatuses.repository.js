import BaseRepository from "./baseRepository.js";

class TicketStatusesRepository extends BaseRepository {
  constructor() {
    super("ticket_statuses", "status_id");
  }
}

export default new TicketStatusesRepository();