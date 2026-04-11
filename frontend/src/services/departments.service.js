import axios from "axios";

const API = "http://localhost:3000/api/departments";

export const getDepartmentsByCompany = (companyId) =>
  axios.get(`${API}/by-company?company_id=${companyId}`);

export const createDepartment = (data) =>
  axios.post(API, data);

export const updateDepartment = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteDepartment = (id) =>
  axios.delete(`${API}/${id}`);