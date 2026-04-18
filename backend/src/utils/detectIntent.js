export const detectIntent = (message) => {
  const text = message.toLowerCase();

  // GENERAR ticket (más agresivo)
  if (
    text.includes("crear ticket") ||
    text.includes("generar ticket") ||
    text.includes("ayudame a crear") ||
    text.includes("problema") ||
    text.includes("error") ||
    text.includes("no funciona") ||
    text.includes("fallo") ||
    text.includes("caido") ||
    text.includes("se cayó")
  ) {
    return "ticket_generate";
  }

  // EXPLICAR cómo crear
  if (
    text.includes("qué necesito") ||
    text.includes("que necesito") ||
    text.includes("como crear ticket") ||
    text.includes("cómo crear un ticket")
  ) {
    return "ticket_help";
  }

  return "general";
};