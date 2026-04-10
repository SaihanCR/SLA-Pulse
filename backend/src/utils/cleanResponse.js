export const cleanResponse = (text) => {
  if (!text) return "";

  return text
    .replace(/[*_#@`~]/g, "")   // elimina símbolos raros
    .replace(/\n{2,}/g, "\n")   // limpia saltos de línea
    .replace(/\s{2,}/g, " ")    // limpia espacios duplicados
    .trim();
};