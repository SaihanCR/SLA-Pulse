import axios from "axios";

const API_URL = "http://localhost:3000/api/priorities";

export const getPriorities = () => axios.get(API_URL);
export const getPriorityById = (id) => axios.get(`${API_URL}/${id}`);
export const createPriority = (data) => axios.post(API_URL, data);
export const updatePriority = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePriority = (id) => axios.delete(`${API_URL}/${id}`);