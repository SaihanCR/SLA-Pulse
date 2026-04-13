import dashboardRepository from "../repositories/dashboard.repository.js";

const getDashboardKpis = async ({ companyId }) => {
  return await dashboardRepository.fetchKpis(companyId);
};

const getDashboardCharts = async ({ companyId }) => {
  return await dashboardRepository.fetchCharts(companyId);
};

const getDashboardAlerts = async () => {
  return await dashboardRepository.fetchAlerts();
};

const getDashboardOverview = async ({ companyId }) => {
  const [kpis, charts, alerts] = await Promise.all([
    dashboardRepository.fetchKpis(companyId),
    dashboardRepository.fetchCharts(companyId),
    dashboardRepository.fetchAlerts(),
  ]);

  return {
    kpis,
    charts,
    alerts,
  };
};

export default {
  getDashboardKpis,
  getDashboardCharts,
  getDashboardAlerts,
  getDashboardOverview,
};