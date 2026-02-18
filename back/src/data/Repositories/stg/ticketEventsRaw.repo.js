// Repositorio específico para la tabla "ticket_events_raw".
// Esta tabla pertenece a la capa STG (staging) y almacena eventos crudos
// provenientes de integraciones o procesos de ingestión.
//
// Aquí solo debe existir acceso a datos. No se implementa lógica de negocio.

import BaseRepository from "../../baseRepository.js";

export default class TicketEventsRawRepository extends BaseRepository {
  constructor() {
    super("ticket_events_raw");
  }

  // Obtiene eventos por ticket_id
  // Útil para depuración o trazabilidad de eventos crudos
  async findByTicketId(ticketId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        ticket_id: ticketId,
      },
    });
  }

  // Obtiene eventos por tipo de evento (event_type)
  async findByEventType(eventType, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        event_type: eventType,
      },
    });
  }

  // Obtiene eventos dentro de un rango de fechas
  async findByDateRange(startDate, endDate) {
    let query = this.supabase
      .from(this.table)
      .select("*")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }
}
