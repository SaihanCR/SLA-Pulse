// Repositorio específico para la tabla "services".
// Pertenece a la capa RULES y almacena el catálogo de servicios monitoreados.
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class ServicesRepository extends BaseRepository {
  constructor() {
    super("services");
  }

  // Busca servicios por nombre (búsqueda parcial).
  // Nota: ajusta "name" si tu columna real se llama diferente.
  async searchByName(name, { limit = 50, offset = 0 } = {}) {
    const { data, error, count } = await this.supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .ilike("name", `%${name}%`)
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { data, count, limit, offset };
  }

  // Obtiene servicios activos (si existe columna is_active).
  async findActive(options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        is_active: true,
      },
    });
  }

  // Obtiene servicios por departamento dueño (owner_department_id).
  async findByOwnerDepartment(departmentId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        owner_department_id: departmentId,
      },
    });
  }
}
