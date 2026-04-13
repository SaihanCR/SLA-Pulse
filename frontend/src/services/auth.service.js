// src/services/auth.service.js
import axios from "axios";

const API = "http://localhost:3000/api/auth";

export const login = (user_email, user_psw) =>
  axios.post(`${API}/login`, { user_email, user_psw });

export const logout = () =>
  axios.post(`${API}/logout`);

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!localStorage.getItem("token");

export const isAdmin = () => localStorage.getItem("userRole") === "ADMINISTADOR";