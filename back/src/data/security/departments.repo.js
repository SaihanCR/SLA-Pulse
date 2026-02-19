// Repositorio específico para la tabla "departments".
// Pertenece a la capa SECURITY y almacena el catálogo de departamentos.
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class DepartmentsRepository extends BaseRepository {
  constructor() {
    super("departments");
  }

  // Busca departamentos por nombre (búsqueda parcial).
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

  // Obtiene un departamento por nombre exacto.
  // Nota: ajusta "name" si tu columna real se llama diferente.
  async findByName(name) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("name", name)
      .single();

    if (error) throw error;

    return data;
  }

  // Obtiene un departamento por código (si existe columna "code").
  // Si tu tabla no tiene "code", puedes eliminar este método.
  async findByCode(code) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("code", code)
      .single();

    if (error) throw error;

    return data;
  }
}
