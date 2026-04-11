import axios from "axios";

const API = "http://localhost:3000/api/companies";

export const getCompanies = () => axios.get(API);
export const createCompany = (data) => axios.post(API, data);
export const updateCompany = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteCompany = (id) => axios.delete(`${API}/${id}`);