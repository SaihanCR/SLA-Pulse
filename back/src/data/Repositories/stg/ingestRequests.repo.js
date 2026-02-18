// Repositorio específico para la tabla "ingest_requests".
// Pertenece a la capa STG (staging) y registra solicitudes de ingestión
// (por ejemplo: cargas, reintentos, estado del proceso, fuente, etc.).
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "./baseRepository.js";

export default class IngestRequestsRepository extends BaseRepository {
  constructor() {
    super("ingest_requests");
  }

  // Obtiene solicitudes por estado (ej: pending, processing, completed, failed).
  // Nota: ajusta "status" si tu columna real tiene otro nombre.
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        status,
      },
    });
  }

  // Obtiene solicitudes por fuente (source_system, source, provider, etc.).
  // Nota: ajusta "source" si tu columna real se llama diferente.
  async findBySource(source, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        source,
      },
    });
  }

  // Obtiene solicitudes dentro de un rango de fechas.
  // Nota: ajusta "created_at" si tu columna real tiene otro nombre.
  async findByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      throw error;
    }

    return data;
  }
}
