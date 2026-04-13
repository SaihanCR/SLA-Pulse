import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { isAuthenticated, isAdmin } from "../services/auth.service";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
//import DepartmentsPage from "../pages/DepartmentsPage";
import SlasPage from "../pages/SlasPage";
import CompaniesPage from "../pages/CompaniesPage";
import UsersPage from "../pages/UsersPage";
import RolesPage from "../pages/RolesPage";
import TicketsPage from "../pages/TicketsPage";
//import CreateTicketPage from "../pages/CreateTicketPage";

// Si NO hay sesión deja pasar, si HAY sesión manda al inicio
function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/companies" /> : children;
}

// Si HAY sesión deja pasar, si NO hay sesión manda al login
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// si HAY sesión y el rol es admin deja pasar a todas las rutas, si HAY sesión pero NO es admin manda a tickets, si NO hay sesión manda al login
function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/tickets" />;
  return children;
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas — bloqueadas si ya hay sesión */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Rutas privadas */}
        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>
          {/* rutas de administrador */}
          <Route index path="companies" element={
            <AdminRoute><CompaniesPage /></AdminRoute>
          } />

          <Route path="slas" element={
            <AdminRoute><SlasPage /></AdminRoute>
          } />
          <Route path="users" element={
            <AdminRoute><UsersPage /></AdminRoute>
          } />
          <Route path="roles" element={
            <AdminRoute><RolesPage /></AdminRoute>
          } />

          {/* rutas de usuario común */}

          <Route path="tickets" element={<TicketsPage />} />
          {/* <Route path="tickets/create" element={<CreateTicketPage />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;