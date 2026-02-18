// Repositorio específico para la tabla "ticket_events".
// Pertenece a la capa HIST y almacena el historial de eventos procesados por ticket.
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "./baseRepository.js";

export default class TicketEventsRepository extends BaseRepository {
  constructor() {
    super("ticket_events");
  }

  // Obtiene eventos por ticket_id.
  // Útil para ver la trazabilidad completa de un ticket.
  async findByTicketId(ticketId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        ticket_id: ticketId,
      },
    });
  }

  // Obtiene eventos por tipo de evento (event_type).
  // Útil para auditoría o análisis por categoría de evento.
  async findByEventType(eventType, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        event_type: eventType,
      },
    });
  }

  // Obtiene eventos dentro de un rango de fechas.
  // Nota: ajusta "created_at" si tu columna real es otra (ej. occurred_at).
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
