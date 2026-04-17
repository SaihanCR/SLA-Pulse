import { openRouterProvider } from "./providers/openrouter.js";
import { detectIntent } from "../../utils/detectIntent.js";
import ticketOptionsService from "../ticketOptions.service.js";

// =========================
// PROMPT GENERAL
// =========================
const GENERAL_PROMPT = `
Eres Ing. Pulsito, asistente virtual del sistema SLA Pulse.

Eres especialista en gestión de tickets y acuerdos de nivel de servicio (SLA).

Tu función es ayudar a los usuarios con el sistema de tickets.

Responde de forma clara y MUY breve.

REGLAS:
- Máximo 3 líneas
- No inventes información
- No uses ejemplos largos
- No menciones links, teléfonos o correos
- No expliques procesos internos
- No hagas listas largas
- PROHIBIDO generar código o comandos

Si te preguntan quién eres:
Responde que eres Ing. Pulsito, asistente de SLA Pulse especializado en tickets y SLA.

Si hay un problema:
Indica que debe crear un ticket
`;

// =========================
// PROMPT AYUDA
// =========================
const TICKET_HELP_PROMPT = `
Eres Ing. Pulsito, asistente del sistema SLA Pulse.

Tu tarea es explicar cómo crear un ticket en ESTE sistema.

Campos reales del sistema:
Compañía
Departamento solicitante
Departamento responsable
Prioridad
Estatus
SLA
Título
Descripción

REGLAS ESTRICTAS:
- Máximo 6 líneas
- No inventes campos
- No menciones otros sistemas
- No agregues ejemplos largos
- No uses símbolos raros
- No uses listas ni numeración
- SOLO puedes usar los campos listados arriba
- NO inventes campos como usuario, entorno, adjuntos o historial
`;

// =========================
// FORMATEO LISTAS
// =========================
const formatList = (items, key) => {
  if (!items || items.length === 0) return "No disponible";
  return items.map(i => i[key]).join(", ");
};

// =========================
// PROMPT GENERADOR
// =========================
const buildTicketPrompt = (options) => {
  const { departments, priorities, statuses, slas } = options;

  return `
GENERADOR DE TICKETS - MODO ESTRICTO

NO puedes hablar.
NO puedes explicar.
NO puedes agregar texto extra.

SOLO puedes responder con el formato.

VALORES:

Departamentos: ${formatList(departments, "department_name")}
Prioridades: ${formatList(priorities, "priority_name")}
Estatus: ${formatList(statuses, "status_name")}
SLA: ${formatList(slas, "sla_title")}

FORMATO:

Compañía sugerida:
<valor>

Departamento solicitante sugerido:
<valor>

Departamento responsable sugerido:
<valor>

Prioridad sugerida:
<valor>

Estatus sugerido:
<valor>

SLA sugerido:
<valor>

Título sugerido:
<texto>

Descripción sugerida:
<texto>
`;
};

// =========================
// LIMPIEZA
// =========================
const cleanAndLimitResponse = (text, maxLength = 500) => {
  if (!text) return "";

  let cleaned = text;

  cleaned = cleaned.replace(/[*#|]/g, "");
  cleaned = cleaned.replace(/https?:\/\/\S+/g, "");
  cleaned = cleaned.replace(/\+?\d[\d\s-]{7,}/g, "");
  cleaned = cleaned.replace(/(bash|php|exec|system|cmd)/gi, "");

  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned.trim();
};

// =========================
// FORMATO VISUAL
// =========================
const enforceLineBreaks = (text) => {
  return text
    .replace(/Compañía sugerida:/g, "\nCompañía sugerida:\n")
    .replace(/Departamento solicitante sugerido:/g, "\nDepartamento solicitante sugerido:\n")
    .replace(/Departamento responsable sugerido:/g, "\nDepartamento responsable sugerido:\n")
    .replace(/Prioridad sugerida:/g, "\nPrioridad sugerida:\n")
    .replace(/Estatus sugerido:/g, "\nEstatus sugerido:\n")
    .replace(/SLA sugerido:/g, "\nSLA sugerido:\n")
    .replace(/Título sugerido:/g, "\nTítulo sugerido:\n")
    .replace(/Descripción sugerida:/g, "\nDescripción sugerida:\n")
    .trim();
};

// =========================
// SEGURIDAD
// =========================
const isDangerousResponse = (text) => {
  if (!text) return true;

  const lower = text.toLowerCase();

  return (
    lower.includes("bash") ||
    lower.includes("php") ||
    lower.includes("exec") ||
    lower.includes("system(") ||
    lower.includes("{") ||
    lower.includes("}") ||
    lower.includes("console.log") ||
    lower.includes("import ")
  );
};

// =========================
// FORZAR COMPAÑÍA REAL
// =========================
const forceCompany = (text, companyName) => {
  if (!text.includes("Compañía sugerida:")) return text;

  return text.replace(
    /Compañía sugerida:\s*\n?.*/i,
    `Compañía sugerida:\n${companyName}`
  );
};

// =========================
// NOTA FINAL
// =========================
const addCompanyNote = (text) => {
  if (!text.includes("Compañía sugerida:")) return text;

  return `${text}

Nota:
Si usted pertenece a otra compañía, debe seleccionar la correspondiente.
Los departamentos dependen de la compañía seleccionada y pueden consultarse en el apartado de crear tickets.`;
};

// =========================
// CACHE
// =========================
const cache = new Map();

// =========================
// FUNCIÓN PRINCIPAL
// =========================
export const chatWithAI = async (message) => {
  const start = Date.now();

  try {
    if (cache.has(message)) {
      console.log("CACHE HIT");
      return cache.get(message);
    }

    const intent = detectIntent(message);
    console.log("INTENT:", intent);

    let prompt;
    let options = null;

    if (intent === "ticket_generate") {
      options = await ticketOptionsService.getTicketOptions();
      console.log("OPTIONS:", options);
      prompt = buildTicketPrompt(options);

    } else if (intent === "ticket_help") {
      prompt = TICKET_HELP_PROMPT;

    } else {
      prompt = GENERAL_PROMPT;
    }

    let response = await openRouterProvider(message, prompt);

    response = cleanAndLimitResponse(response);
    response = enforceLineBreaks(response);

    if (isDangerousResponse(response)) {
      return {
        intent,
        response: "No puedo procesar esa solicitud."
      };
    }

    // =========================
    // VALIDACIÓN Y CORRECCIÓN
    // =========================
    if (intent === "ticket_generate") {

      if (!response.includes("Compañía sugerida:")) {
        response = `Compañía sugerida:
SLA Pulse

Departamento solicitante sugerido:
Administración

Departamento responsable sugerido:
TI

Prioridad sugerida:
Media

Estatus sugerido:
Abierto

SLA sugerido:
SLA General

Título sugerido:
Solicitud de soporte

Descripción sugerida:
El usuario reporta un problema en el sistema.`;
      }

      // 🔥 FORZAR COMPAÑÍA REAL
      const companyName =
        options?.companies?.[0]?.company_name || "SLA Pulse";

      response = forceCompany(response, companyName);

      response = addCompanyNote(response);
    }

    if (!response || response.length < 10) {
      response = "No se pudo generar una respuesta válida.";
    }

    const end = Date.now();

    console.log("MÉTRICAS:", {
      intent,
      duration: `${end - start} ms`,
    });

    const result = { intent, response };

    cache.set(message, result);

    return result;

  } catch (error) {
    console.error("ERROR IA:", error.message);
    throw error;
  }
};