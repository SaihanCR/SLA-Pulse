// Lista blanca de tablas permitidas.
// Aunque todas están en schema public, se agrupan lógicamente
// para simular capas (stg, rules, golden, hist, security).

export const TABLE_GROUPS = {
  stg: ["ingest_requests", "ticket_events_raw"],

  rules: ["services", "sla_policies", "alert_rules"],

  golden: ["ticket_current_state", "sla_summary_by_service", "alerts"],

  hist: ["tickets", "ticket_events", "sla_evaluations"],

  security: ["roles", "user_roles", "user_profile", "departments"]
};

// Lista plana final permitida
export const ALLOWED_TABLES = Object.values(TABLE_GROUPS).flat();

export function isAllowedTable(tableName) {
  return ALLOWED_TABLES.includes(tableName);
}
