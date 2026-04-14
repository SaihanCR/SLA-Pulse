/**
 * Decodifica de forma segura el payload de un JWT.
 */
const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    console.error("Error decoding JWT payload:", error);
    return null;
  }
};

/**
 * Obtiene el usuario actual sin depender de cambios en login ni auth service.
 * Usa localStorage existente y extrae user_id desde el token.
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const company_id = localStorage.getItem("userCompany");
  const department_id = localStorage.getItem("userDepartment");

  if (!token) return null;

  const payload = decodeJwtPayload(token);

  return {
    user_id: payload?.sub || null,
    full_name:
      payload?.user_metadata?.full_name ||
      payload?.user_metadata?.name ||
      payload?.email ||
      "Usuario autenticado",
    email: payload?.email || null,
    role: role || null,
    company_id: company_id || null,
    department_id: department_id || null,
  };
};