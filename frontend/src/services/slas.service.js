import axios from "axios";

const API_URL = "http://localhost:3000/api/slas";

export const getSlas = () => axios.get(API_URL);
export const getSlaById = (id) => axios.get(`${API_URL}/${id}`);
export const getSlasByDepartment = (departmentId) =>
axios.get(`${API_URL}/by-department?department_id=${departmentId}`);

export const createSla = (data) => axios.post(API_URL, data);
export const updateSla = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSla = (id) => axios.delete(`${API_URL}/${id}`);