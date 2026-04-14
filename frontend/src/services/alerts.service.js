import api from "./api";

export const runAlertsEngine = () => {
  return api.post("/alerts/run");
};

export const getAlerts = () => {
  return api.get("/alerts/active");
};