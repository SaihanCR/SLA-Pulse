import axios from "axios";

const API_URL = "http://localhost:3000/api/tickets";

export const getTickets = () => axios.get(API_URL);
export const getTicketById = (id) => axios.get(`${API_URL}/${id}`);
export const getTicketDetail = (id) => axios.get(`${API_URL}/${id}/detail`);

export const getTicketsByCompany = (companyId) =>
  axios.get(`${API_URL}/by-company?company_id=${companyId}`);

export const getTicketsByStatus = (statusId) =>
  axios.get(`${API_URL}/by-status?status_id=${statusId}`);

export const getTicketsByPriority = (priorityId) =>
  axios.get(`${API_URL}/by-priority?priority_id=${priorityId}`);

export const getTicketsByResponsibleDepartment = (departmentId) =>
  axios.get(
    `${API_URL}/by-responsible-department?responsible_department_id=${departmentId}`
  );

export const getTicketsByRequesterDepartment = (departmentId) =>
  axios.get(
    `${API_URL}/by-requester-department?requester_department_id=${departmentId}`
  );

export const searchTickets = (term) =>
  axios.get(`${API_URL}/search?term=${encodeURIComponent(term)}`);

export const createTicket = (data) => axios.post(API_URL, data);
export const updateTicket = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTicket = (id) => axios.delete(`${API_URL}/${id}`);