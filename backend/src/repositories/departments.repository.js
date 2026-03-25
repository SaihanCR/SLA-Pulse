import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';

class DepartmentsRepository extends BaseRepository {
  constructor() {
    // Tabla y primary key
    super('departments', 'department_id');
  }

  async findByName(name) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .ilike('department_name', `%${name}%`);

    if (error) {
      throw new Error(`Error al buscar departamentos: ${error.message}`);
    }

    return data;
  }
}

export default new DepartmentsRepository();