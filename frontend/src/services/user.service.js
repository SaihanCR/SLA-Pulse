// src/services/users.service.js
import axios from "axios";

const API = "http://localhost:3000/api/users";

export const getAllUsers = () =>
  axios.get(API);

export const getUserById = (id) =>
  axios.get(`${API}/${id}`);

export const createUser = (data) =>
  axios.post(API, data);
  // data debe tener: { company_id, role_id, department_id,
  //                    first_name, last_name, job_title,
  //                    is_active, user_email, user_psw }

export const updateUser = (id, data) =>
  axios.put(`${API}/${id}`, data);
  // data puede tener cualquiera de los campos de createUser
  // user_email y user_psw son opcionales en update

export const deleteUser = (id) =>
  axios.delete(`${API}/${id}`);