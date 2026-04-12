import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";

import DepartmentsPage from "../pages/DepartmentsPage";
import SlasPage from "../pages/SlasPage";
import CompaniesPage from "../pages/CompaniesPage";
import UsersPage from "../pages/UsersPage";
import RolesPage from "../pages/RolesPage";
import TicketsPage from "../pages/TicketsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DepartmentsPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="slas" element={<SlasPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="tickets" element={<TicketsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;