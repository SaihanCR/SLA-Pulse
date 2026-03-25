import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';

class SlasRepository extends BaseRepository {
  constructor() {
    super('slas', 'sla_id');
  }

  async findByDepartment(departmentId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('department_id', departmentId);

    if (error) {
      throw new Error(`Error al buscar SLAs por departamento: ${error.message}`);
    }

    return data;
  }
}

export default new SlasRepository();