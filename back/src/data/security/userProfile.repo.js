// Repositorio específico para la tabla "user_profile".
// Pertenece a la capa SECURITY y almacena el perfil extendido del usuario,
// incluyendo su relación con departments.
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class UserProfileRepository extends BaseRepository {
  constructor() {
    super("user_profile");
  }

  // Obtiene el perfil por user_id (relación con auth.users)
  async findByUserId(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return data;
  }

  // Obtiene perfiles por departamento
  async findByDepartment(departmentId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        department_id: departmentId,
      },
    });
  }

  // Obtiene perfiles incluyendo información del departamento (join)
  // Esto usa relación FK configurada en Supabase.
  async findWithDepartment(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        *,
        departments (*)
      `)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return data;
  }
}
