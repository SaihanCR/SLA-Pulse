import supabase from "../config/supabase.js";

const fetchKpis = async (companyId) => {
  const { data, error } = await supabase.rpc("get_admin_dashboard_kpis", {
    p_company_id: companyId || null,
  });

  if (error) {
    throw new Error(`KPIs: ${error.message}`);
  }

  return data;
};

const fetchCharts = async (companyId) => {
  const [statusResult, trendResult] = await Promise.all([
    supabase.rpc("get_admin_tickets_by_status", {
      p_company_id: companyId || null,
    }),
    supabase.rpc("get_admin_tickets_trend", {
      p_company_id: companyId || null,
    }),
  ]);

  if (statusResult.error) {
    throw new Error(`Charts status: ${statusResult.error.message}`);
  }

  if (trendResult.error) {
    throw new Error(`Charts trend: ${trendResult.error.message}`);
  }

  return {
    ticketsByStatus: statusResult.data,
    ticketsTrend: trendResult.data,
  };
};

const fetchAlerts = async () => {
  return [];
};

export default {
  fetchKpis,
  fetchCharts,
  fetchAlerts,
};