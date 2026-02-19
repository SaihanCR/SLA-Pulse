// Repositorio específico para la tabla "roles".
// Pertenece a la capa SECURITY y almacena el catálogo de roles del sistema.
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class RolesRepository extends BaseRepository {
  constructor() {
    super("roles");
  }

  // Obtiene un rol por nombre exacto (ej: admin, responsable, solicitante).
  // Nota: ajusta "name" si tu columna real se llama diferente (role_name, code, etc.).
  async findByName(name) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("name", name)
      .single();

    if (error) throw error;

    return data;
  }

  // Busca roles por nombre (búsqueda parcial).
  async searchByName(name, { limit = 50, offset = 0 } = {}) {
    const { data, error, count } = await this.supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .ilike("name", `%${name}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { data, count, limit, offset };
  }
}
