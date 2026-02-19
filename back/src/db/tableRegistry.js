// Registro central de metadatos por tabla.
// Permite definir primaryKey sin hardcode en controllers o services.

export const TABLE_REGISTRY = {
  services: { primaryKey: "id" },
  sla_policies: { primaryKey: "id" },
  alert_rules: { primaryKey: "id" },

  ingest_requests: { primaryKey: "id" },
  ticket_events_raw: { primaryKey: "id" },

  tickets: { primaryKey: "id" },
  ticket_events: { primaryKey: "id" },
  sla_evaluations: { primaryKey: "id" },

  ticket_current_state: { primaryKey: "id" },
  sla_summary_by_service: { primaryKey: "id" },
  alerts: { primaryKey: "id" },

  roles: { primaryKey: "id" },
  user_roles: { primaryKey: "id" },
  departments: { primaryKey: "id" },
  user_profile: { primaryKey: "id" }
};

export function getPrimaryKey(tableName) {
  return TABLE_REGISTRY[tableName]?.primaryKey || "id";
}
