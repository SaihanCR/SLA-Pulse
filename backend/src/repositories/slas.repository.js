import BaseRepository from './baseRepository.js';

class SlasRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla slas
    super('slas', 'sla_id');
  }
}

export default new SlasRepository();