// Repositorio específico para la tabla "services".
// Pertenece a la capa RULES y almacena el catálogo de servicios monitoreados
// (ej: nombre, dueño/responsable, criticidad, canal, etc.).
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "./baseRepository.js";

export default class ServicesRepository extends BaseRepository {
  constructor() {
    super("services");
  }

  // Busca servicios por nombre (búsqueda parcial).
  // Nota: requiere que exista la columna "name". Ajusta si tu modelo usa otro nombre (service_name, title, etc.).
  async searchByName(name) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .ilike("name", `%${name}%`);

    if (error) {
      throw error;
    }

    return data;
  }

  // Obtiene servicios activos (si existe columna is_active).
  // Ajusta el nombre de la columna si tu modelo usa "active" u otro.
  async findActive(options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        is_active: true,
      },
    });
  }
}
