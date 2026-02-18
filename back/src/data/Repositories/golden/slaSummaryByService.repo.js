// Repositorio específico para la tabla "sla_summary_by_service".
// Pertenece a la capa GOLDEN y almacena métricas/resúmenes agregados de SLA por servicio.
// Es una tabla clave para dashboards (cumplimiento, breached, tiempos promedio, etc.).
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "./baseRepository.js";

export default class SlaSummaryByServiceRepository extends BaseRepository {
  constructor() {
    super("sla_summary_by_service");
  }

  // Obtiene el resumen por service_id (si la columna existe).
  // Útil para traer un servicio específico sin filtrar manualmente desde el controller.
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene resúmenes dentro de un rango de fechas.
  // Nota: ajusta "summary_date" si tu tabla usa otro nombre (ej. as_of_date, created_at).
  async findByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .gte("summary_date", startDate)
      .lte("summary_date", endDate);

    if (error) {
      throw error;
    }

    return data;
  }
}
