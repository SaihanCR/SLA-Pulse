export const parseResponse = (text) => {
  const getValue = (label) => {
    const regex = new RegExp(`${label}:\\s*(.*)`);
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    titulo: getValue("Título sugerido"),
    descripcion: getValue("Descripción sugerida"),
    prioridad: getValue("Prioridad sugerida"),
    departamento: getValue("Departamento responsable sugerido"),
    raw: text
  };
};