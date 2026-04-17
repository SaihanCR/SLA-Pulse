import supabase from "../config/supabase.js";

const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from("companies")
    .select("company_id, company_name")
    .eq("is_active", true);

  if (error) throw new Error(error.message);
  return data;
};

const fetchDepartments = async () => {
  const { data, error } = await supabase
    .from("departments")
    .select("department_id, department_name, company_id")
    .eq("is_active", true);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPriorities = async () => {
  const { data, error } = await supabase
    .from("priorities")
    .select("priority_id, priority_name");

  if (error) throw new Error(error.message);
  return data;
};

const fetchStatuses = async () => {
  const { data, error } = await supabase
    .from("ticket_statuses")
    .select("status_id, status_name");

  if (error) throw new Error(error.message);
  return data;
};

const fetchSlas = async () => {
  const { data, error } = await supabase
    .from("slas")
    .select(`
      sla_id,
      sla_title,
      sla_hours,
      priority_id,
      department_id
    `)
    .eq("is_active", true);

  if (error) throw new Error(error.message);
  return data;
};

export default {
  fetchCompanies,
  fetchDepartments,
  fetchPriorities,
  fetchStatuses,
  fetchSlas,
};