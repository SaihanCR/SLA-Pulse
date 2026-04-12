//Esto se va a modificar cuando tengamos el login implementado, por ahora es un mock para probar la app sin necesidad de autenticación

export const getCurrentUser = () => {
  return {
    user_id: "8251453d-f08f-4de6-8aec-1f39b203ef20",
    full_name: "Usuario Mock",
    company_id: "7019735c-daa2-404a-bdf2-d6683596731e",
    department_id: "07e719ea-aacb-4f1e-8b78-510ff5cfb4b8",
  };
};