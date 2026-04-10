export const detectIntent = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("crear ticket") ||
    text.includes("hacer ticket") ||
    text.includes("ayuda con ticket") ||
    text.includes("tengo un problema") ||
    text.includes("error") ||
    text.includes("no puedo")
  ) {
    return "ticket";
  }

  return "general";
};