// Repositorio específico para la tabla "alert_rules".
// Pertenece a la capa RULES y almacena las reglas que determinan
// cuándo debe generarse una alerta (ej: thresholds, condiciones SLA, etc.).
//
// Aquí solo se implementa acceso a datos (DAL).
// La lógica de evaluación de reglas debe vivir en la capa Service.

import BaseRepository from "./baseRepository.js";

export default class AlertRulesRepository extends BaseRepository {
  constructor() {
    super("alert_rules");
  }

  // Obtiene reglas por service_id (si la columna existe).
  async findByServiceId(serviceId, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        service_id: serviceId,
      },
    });
  }

  // Obtiene reglas activas (si existe columna is_active o active).
  // Ajusta el nombre según tu modelo real.
  async findActive(options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        is_active: true,
      },
    });
  }

  // Obtiene reglas por tipo (ej: breach, warning, latency).
  // Ajusta "rule_type" si tu columna real tiene otro nombre.
  async findByType(ruleType, options = {}) {
    return this.findAll({
      ...options,
      filters: {
        ...(options.filters || {}),
        rule_type: ruleType,
      },
    });
  }
}
