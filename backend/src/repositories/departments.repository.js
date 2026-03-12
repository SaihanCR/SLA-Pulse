import BaseRepository from './baseRepository.js';

class DepartmentsRepository extends BaseRepository {
  constructor() {
    // Repositorio para la tabla departments
    // Ajusta el nombre del campo PK si en tu tabla no es "id"
    super('departments', 'department_id');
  }
}

export default new DepartmentsRepository();