// Repositorio específico para la tabla "sla_evaluations".
// Pertenece a la capa HIST y almacena las evaluaciones
// de cumplimiento de SLA por ticket.
//
// Aquí solo se implementa acceso a datos.
// La lógica de negocio debe vivir en la capa Service.

import BaseRepository from "../baseRepository.js";

export default class SlaEvaluationsRepository extends BaseRepository {
  constructor() {
    super("sla_evaluations");
  }

  // Obtiene evaluaciones por ticket_id
  // Útil para consultar el historial SLA de un ticket específico
  async findByTicketId(ticketId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        ticket_id: ticketId,
      },
    });
  }

  // Obtiene evaluaciones por service_id
  // Permite análisis agregado por servicio
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene evaluaciones que hayan incumplido SLA (breached)
  // Asume que existe una columna booleana "breached"
  async findBreached(options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        breached: true,
      },
    });
  }

  // Obtiene evaluaciones dentro de un rango de fechas
  async findByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .gte("evaluated_at", startDate)
      .lte("evaluated_at", endDate);

    if (error) {
      throw error;
    }

    return data;
  }
}
