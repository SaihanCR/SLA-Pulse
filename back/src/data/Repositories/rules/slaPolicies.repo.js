// Repositorio específico para la tabla "sla_policies".
// Pertenece a la capa RULES y define las políticas de SLA asociadas
// a cada servicio (ej: tiempo máximo de resolución, tiempo de respuesta, etc.).
//
// Aquí solo se implementa acceso a datos (DAL).
// La lógica de validación y cálculo debe vivir en la capa Service.

import BaseRepository from "./baseRepository.js";

export default class SlaPoliciesRepository extends BaseRepository {
  constructor() {
    super("sla_policies");
  }

  // Obtiene políticas por service_id.
  // Útil para cargar las reglas SLA de un servicio específico.
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene políticas activas (si existe columna is_active).
  // Ajusta el nombre si tu modelo usa otro campo.
  async findActive(options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        is_active: true,
      },
    });
  }

  // Obtiene políticas por tipo de SLA (ej: response_time, resolution_time).
  // Ajusta "sla_type" si tu columna real tiene otro nombre.
  async findByType(slaType, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        sla_type: slaType,
      },
    });
  }
}
