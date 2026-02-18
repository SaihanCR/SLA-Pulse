// Repositorio específico para la tabla "tickets".
// Extiende BaseRepository para heredar operaciones CRUD genéricas,
// pero permite agregar métodos especializados del dominio Tickets.

import BaseRepository from "../../baseRepository.js";

export default class TicketsRepository extends BaseRepository {
  constructor() {
    // Se inicializa el repositorio con el nombre de la tabla
    super("tickets");
  }

  // Obtiene tickets por service_id
  // Útil para análisis por servicio dentro del SLA Pulse
  async findByServiceId(serviceId) {
    const { data, error } = await this.client()
      .select("*")
      .eq("service_id", serviceId);

    if (error) {
      throw error;
    }

    return data;
  }

  // Obtiene tickets por status (ej: open, closed, breached)
  async findByStatus(status) {
    const { data, error } = await this.client()
      .select("*")
      .eq("status", status);

    if (error) {
      throw error;
    }

    return data;
  }

  // Método interno para mantener consistencia con el BaseRepository
  // Permite reutilizar la conexión sin duplicar lógica
  client() {
    return this.supabase.from(this.table);
  }
}
