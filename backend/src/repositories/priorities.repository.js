import BaseRepository from './baseRepository.js';

class PrioritiesRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla priorities
    super('priorities', 'priority_id');
  }
}

export default new PrioritiesRepository();