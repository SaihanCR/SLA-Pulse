import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';
class UsersRepository extends BaseRepository {
  constructor() {
    // Acceso a la tabla users
    super('users', 'user_id');
  }

  // Método para verificar si un código de usuario ya existe en la base de datos
  async codeExists(int_cod_user) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('int_cod_user')
      .eq('int_cod_user', int_cod_user)
      .single();
    return !!data;
  }


}

export default new UsersRepository();