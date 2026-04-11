import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import CompaniesPage from "./pages/CompaniesPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/companies" element={<CompaniesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;