import BaseRepository from './baseRepository.js';

class RolesRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla roles
    super('roles', 'role_id');
  }
}

export default new RolesRepository();