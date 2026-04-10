import { openRouterProvider } from "./providers/openrouter.js";
import { detectIntent } from "../../utils/detectIntent.js";

// prompts separados
const GENERAL_PROMPT = `
Eres un asistente experto en gestión de tickets con SLA.

Responde dudas de forma clara y profesional.

Reglas:
- Responde en español claro
- Sé directo
- No uses símbolos raros
`;

const TICKET_PROMPT = `
Eres un asistente experto en gestión de tickets con SLA.

Tu tarea es ayudar a estructurar tickets.

Responde SIEMPRE en este formato:

Título sugerido:
...

Descripción sugerida:
...

Prioridad sugerida:
...

Departamento responsable sugerido:
...

Reglas:
- No uses símbolos raros
- Sé claro y profesional
`;

const cache = new Map();

export const chatWithAI = async (message) => {
  const start = Date.now();

  try {
    if (cache.has(message)) {
      console.log("CACHE HIT");
      return cache.get(message);
    }

    const intent = detectIntent(message);

    console.log("INTENT:", intent);

    const prompt =
      intent === "ticket" ? TICKET_PROMPT : GENERAL_PROMPT;

    const response = await openRouterProvider(message, prompt);

    const end = Date.now();

    console.log("MÉTRICAS:", {
      message,
      intent,
      duration: `${end - start} ms`,
      status: "success",
    });

    cache.set(message, { intent, response });

    return { intent, response };

  } catch (error) {
    const end = Date.now();

    console.log("MÉTRICAS:", {
      message,
      duration: `${end - start} ms`,
      status: "error",
    });

    throw error;
  }
};