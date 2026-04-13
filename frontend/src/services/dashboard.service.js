import api from "./api";

const getDashboardOverview = async (companyId = null) => {
  let url = "/dashboard/overview";

  if (companyId) {
    url += `?company_id=${companyId}`;
  }

  const response = await api.get(url);
  return response.data;
};

export default {
  getDashboardOverview
};