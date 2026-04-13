import { useEffect, useState } from "react";
import dashboardService from "../services/dashboard.service";

import KpiCards from "../components/dashboard/KpiCards";
import ChartsSection from "../components/dashboard/ChartsSection";
import AlertsPanel from "../components/dashboard/AlertsPanel";

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await dashboardService.getDashboardOverview();
      setData(res.data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  if (!data) return <div>Cargando dashboard...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

      <KpiCards kpis={data.kpis} />
      <ChartsSection charts={data.charts} />
      <AlertsPanel alerts={data.alerts} />
    </div>
  );
};

export default DashboardPage;