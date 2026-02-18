// Registro central de configuración por tabla.
// Permite asociar metadatos como:
// - Grupo lógico (stg, rules, golden, hist)
// - Columna primaria
// - Select por defecto
// - Columnas permitidas para filtros (opcional, para seguridad futura)
//
// Este archivo facilita escalar hacia validaciones más estrictas
// sin modificar los servicios ni los controladores.

import { ALLOWED_TABLES } from "./allowedTables.js";

export const TABLE_REGISTRY = {
  ingest_requests: {
    group: "stg",
    primaryKey: "id",
    defaultSelect: "*",
  },

  ticket_events_raw: {
    group: "stg",
    primaryKey: "id",
    defaultSelect: "*",
  },

  services: {
    group: "rules",
    primaryKey: "id",
    defaultSelect: "*",
  },

  sla_policies: {
    group: "rules",
    primaryKey: "id",
    defaultSelect: "*",
  },

  alert_rules: {
    group: "rules",
    primaryKey: "id",
    defaultSelect: "*",
  },

  ticket_current_state: {
    group: "golden",
    primaryKey: "id",
    defaultSelect: "*",
  },

  sla_summary_by_service: {
    group: "golden",
    primaryKey: "id",
    defaultSelect: "*",
  },

  alerts: {
    group: "golden",
    primaryKey: "id",
    defaultSelect: "*",
  },

  tickets: {
    group: "hist",
    primaryKey: "id",
    defaultSelect: "*",
  },

  ticket_events: {
    group: "hist",
    primaryKey: "id",
    defaultSelect: "*",
  },

  sla_evaluations: {
    group: "hist",
    primaryKey: "id",
    defaultSelect: "*",
  },
};

// Devuelve configuración de una tabla
export function getTableConfig(tableName) {
  return TABLE_REGISTRY[tableName] || null;
}
