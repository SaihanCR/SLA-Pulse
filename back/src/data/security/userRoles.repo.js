// Repositorio específico para la tabla "user_roles".
// Pertenece a la capa SECURITY y almacena la asignación de rol a cada usuario.
// Regla actual: 1 usuario = 1 rol.
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class UserRolesRepository extends BaseRepository {
  constructor() {
    super("user_roles");
  }

  // Obtiene el rol asignado a un usuario por user_id
  async findByUserId(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        *,
        roles (*)
      `)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return data;
  }

  // Obtiene usuarios por role_id
  async findByRoleId(roleId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        role_id: roleId,
      },
    });
  }

  // Asigna o cambia el rol de un usuario
  // Nota: no validamos aquí si ya existe uno (eso sería lógica de Service)
  async assignRole(userId, roleId) {
    return this.insert({
      user_id: userId,
      role_id: roleId,
    });
  }
}
