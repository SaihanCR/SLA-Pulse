import BaseRepository from './baseRepository.js';

class AlertsRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla alerts
    super('alerts', 'alert_id');
  }
}

export default new AlertsRepository();