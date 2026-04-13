import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { isAuthenticated, isAdmin } from "../services/auth.service";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import SlasPage from "../pages/SlasPage";
import CompaniesPage from "../pages/CompaniesPage";
import UsersPage from "../pages/UsersPage";
import RolesPage from "../pages/RolesPage";
import TicketsPage from "../pages/TicketsPage";
import DashboardPage from "../pages/DashboardPage";

//  RUTA PÚBLICA
function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/tickets" /> : children;
}

//  RUTA PRIVADA
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

//  TEMPORAL (DESARROLLO)
//  NO bloquea por admin mientras pruebas
function AdminRoute({ children }) {
  return children;
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/*  Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/*  Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/*  REDIRECCIÓN POR DEFECTO */}
          <Route index element={<Navigate to="/tickets" />} />

          {/* Admin (temporalmente abiertas) */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="slas" element={<SlasPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />

          {/* Usuario */}
          <Route path="tickets" element={<TicketsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;