import BaseRepository from './baseRepository.js';

class UsersRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla users
    super('users', 'user_id');
  }
}

export default new UsersRepository();