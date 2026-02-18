// Repositorio específico para la tabla "ticket_current_state".
// Pertenece a la capa GOLDEN y representa el estado actual consolidado
// de cada ticket (snapshot más reciente).
//
// Aquí solo se implementa acceso a datos (DAL).
// La lógica de negocio debe implementarse en la capa Service.

import BaseRepository from "./baseRepository.js";

export default class TicketCurrentStateRepository extends BaseRepository {
  constructor() {
    super("ticket_current_state");
  }

  // Obtiene el estado actual de un ticket por ticket_id.
  async findByTicketId(ticketId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        ticket_id: ticketId,
      },
    });
  }

  // Obtiene tickets por status actual (ej: open, closed, breached).
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        status,
      },
    });
  }

  // Obtiene tickets por service_id.
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene registros dentro de un rango de fechas.
  // Ajusta "updated_at" si tu columna real tiene otro nombre.
  async findByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .gte("updated_at", startDate)
      .lte("updated_at", endDate);

    if (error) {
      throw error;
    }

    return data;
  }
}
