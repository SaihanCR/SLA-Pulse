// Definición centralizada de tablas permitidas para el endpoint dinámico.
// Aunque todas están en el schema public, se agrupan lógicamente
// según la arquitectura del proyecto (stg, rules, golden, hist).
// Esto evita accesos arbitrarios a cualquier tabla de la base de datos.

export const ALLOWED_TABLES = {
  stg: [
    "ingest_requests",
    "ticket_events_raw"],
  rules: [
    "services",
    "sla_policies",
    "alert_rules"],
  golden: [
    "ticket_current_state",
    "sla_summary_by_service",
    "alerts"],
  hist: [
    "tickets",
    "ticket_events",
    "sla_evaluations"]
};

// Se construye un Set plano para validaciones rápidas O(1)
export const ALL_ALLOWED_TABLES = new Set(
  Object.values(ALLOWED_TABLES).flat()
);

// Verifica si una tabla está permitida
export function isAllowedTable(tableName) {
  return ALL_ALLOWED_TABLES.has(tableName);
}

// Devuelve el grupo lógico (stg, rules, golden, hist) al que pertenece una tabla
export function getTableGroup(tableName) {
  for (const [group, tables] of Object.entries(ALLOWED_TABLES)) {
    if (tables.includes(tableName)) {
      return group;
    }
  }
  return null;
}
