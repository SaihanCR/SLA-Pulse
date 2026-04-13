import dashboardService from "../services/dashboard.service.js";

const getDashboardKpis = async (req, res) => {
  try {
    const { company_id = null } = req.query;

    const data = await dashboardService.getDashboardKpis({
      companyId: company_id,
    });

    return res.status(200).json({
      ok: true,
      message: "KPIs obtenidos correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en getDashboardKpis:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener KPIs",
      error: error.message,
    });
  }
};

const getDashboardCharts = async (req, res) => {
  try {
    const { company_id = null } = req.query;

    const data = await dashboardService.getDashboardCharts({
      companyId: company_id,
    });

    return res.status(200).json({
      ok: true,
      message: "Charts obtenidos correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en getDashboardCharts:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener charts",
      error: error.message,
    });
  }
};

const getDashboardAlerts = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardAlerts();

    return res.status(200).json({
      ok: true,
      message: "Alertas obtenidas correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en getDashboardAlerts:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener alertas",
      error: error.message,
    });
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const { company_id = null } = req.query;

    const data = await dashboardService.getDashboardOverview({
      companyId: company_id,
    });

    return res.status(200).json({
      ok: true,
      message: "Dashboard completo obtenido",
      data,
    });
  } catch (error) {
    console.error("Error en getDashboardOverview:", error);

    return res.status(500).json({
      ok: false,
      message: "Error en dashboard",
      error: error.message,
    });
  }
};

export default {
  getDashboardKpis,
  getDashboardCharts,
  getDashboardAlerts,
  getDashboardOverview,
};