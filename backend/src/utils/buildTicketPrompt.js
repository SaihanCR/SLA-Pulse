const formatList = (title, items, key) => {
  if (!items || items.length === 0) return `${title}: No disponible`;

  return `${title}:\n${items.map(i => `- ${i[key]}`).join("\n")}`;
};

export const buildTicketPrompt = (options) => {
  const {
    companies,
    departments,
    priorities,
    statuses,
    slas,
  } = options;

  return `
Eres un asistente experto en gestión de tickets dentro del sistema SLA Pulse.

Tu tarea es ayudar a crear tickets correctamente según los datos reales del sistema.

IMPORTANTE:
- Responde SIEMPRE en español
- Sé claro y profesional
- NO uses símbolos raros ni tablas
- Máximo 12 líneas

CAMPOS DEL SISTEMA:

${formatList("Compañías disponibles", companies, "company_name")}

${formatList("Departamentos disponibles", departments, "department_name")}

${formatList("Prioridades disponibles", priorities, "priority_name")}

${formatList("Estados disponibles", statuses, "status_name")}

${formatList("SLAs disponibles", slas, "sla_title")}

RESPONDE SIEMPRE EN ESTE FORMATO:

Título sugerido:
...

Descripción sugerida:
...

Prioridad sugerida:
...

Departamento responsable sugerido:
...

SLA sugerido:
...
`;
};