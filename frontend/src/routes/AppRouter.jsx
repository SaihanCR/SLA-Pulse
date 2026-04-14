import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { isAuthenticated, isAdmin } from "../services/auth.service";

import LoginPage from "../pages/LoginPage";
import SlasPage from "../pages/SlasPage";
import DepartmentsPage from "../pages/DepartmentsPage";
import CompaniesPage from "../pages/CompaniesPage";
import UsersPage from "../pages/UsersPage";
import RolesPage from "../pages/RolesPage";
import TicketsPage from "../pages/TicketsPage";
import DashboardPage from "../pages/DashboardPage";

// Con sesión → redirige, sin sesión → deja pasar
function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/tickets" /> : children;
}

// Sin sesión → login, con sesión → deja pasar
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Sin sesión → login, no es admin → tickets, es admin → deja pasar
function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/tickets" />;
  return children;
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta pública */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />

        {/* Rutas privadas — dentro del Layout */}
        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>

          {/* Ruta raíz: admin va a dashboard, el resto a tickets */}
          <Route index element={
            isAdmin() ? <Navigate to="/dashboard" /> : <Navigate to="/tickets" />
          } />

          {/* Solo admin */}
          <Route path="companies" element={<AdminRoute><CompaniesPage /></AdminRoute>} />
          <Route path="departments" element={<AdminRoute><DepartmentsPage /></AdminRoute>} />
          <Route path="slas" element={<AdminRoute><SlasPage /></AdminRoute>} />
          <Route path="users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="roles" element={<AdminRoute><RolesPage /></AdminRoute>} />

          {/* Todos los roles */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;