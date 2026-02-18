// Repositorio específico para la tabla "alerts".
// Pertenece a la capa GOLDEN y contiene alertas generadas por reglas (alert_rules)
// a partir de SLAs y/o señales de RUM.
//
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "./baseRepository.js";

export default class AlertsRepository extends BaseRepository {
  constructor() {
    super("alerts");
  }

  // Obtiene alertas por service_id (si la columna existe).
  // Útil para dashboards o vistas por servicio.
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene alertas por severidad (si existe "severity").
  async findBySeverity(severity, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        severity,
      },
    });
  }

  // Obtiene alertas por estado (si existe "status": open/closed/acknowledged, etc.).
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        status,
      },
    });
  }

  // Obtiene alertas dentro de un rango de fechas.
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
