// Repositorio específico para la tabla "tickets".
// Pertenece a la capa HIST y almacena los tickets con sus estados y departamentos.
// Aquí solo va acceso a datos (DAL). No incluye lógica HTTP ni endpoints.

import BaseRepository from "../../baseRepository.js";

export default class TicketsRepository extends BaseRepository {
  constructor() {
    super("tickets");
  }

  // Obtiene tickets por service_id
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: { ...(options.filters || {}), service_id: serviceId },
    });
  }

  // Obtiene tickets por status (ej: open, resolved, closed)
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      filters: { ...(options.filters || {}), status },
    });
  }

  // Obtiene tickets por departamento responsable
  async findByResponsibleDepartment(departmentId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        responsible_department_id: departmentId,
      },
    });
  }

  // Obtiene tickets por departamento solicitante
  async findByRequesterDepartment(departmentId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        requester_department_id: departmentId,
      },
    });
  }

  // Marca un ticket como resuelto y registra resolved_at
  // Nota: por ahora no validamos reglas de transición (eso iría en Service)
  async markResolved(ticketId, resolvedAt = new Date().toISOString()) {
    return this.update(ticketId, {
      status: "resolved",
      resolved_at: resolvedAt,
    });
  }

  // Marca un ticket como cerrado y registra closed_at
  async markClosed(ticketId, closedAt = new Date().toISOString()) {
    return this.update(ticketId, {
      status: "closed",
      closed_at: closedAt,
    });
  }
}
