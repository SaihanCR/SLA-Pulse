import axios from "axios";

const API_URL = "http://localhost:3000/api/ticket-statuses";

export const getTicketStatuses = () => axios.get(API_URL);
export const getTicketStatusById = (id) => axios.get(`${API_URL}/${id}`);