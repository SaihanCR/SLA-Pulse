import { useEffect, useState } from "react";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companies.service";

import {
  getDepartmentsByCompany,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departments.service";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    company_name: "",
    company_description: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // 🔥 NEW
  const [deptForm, setDeptForm] = useState({
    department_name: "",
  });

  const [editingDeptId, setEditingDeptId] = useState(null);

  // 🔄 Load companies
  const fetchCompanies = async () => {
    try {
      const res = await getCompanies();
      setCompanies(res.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 📝 Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ➕ Create / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanData = {
      company_name: form.company_name,
      company_description: form.company_description,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await updateCompany(editingId, cleanData);
      } else {
        await createCompany(cleanData);
      }

      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error(error);
      alert("Error guardando empresa");
    }
  };

  // ✏️ Edit
  const handleEdit = (company) => {
    setForm({
      company_name: company.company_name || "",
      company_description: company.company_description || "",
      is_active: company.is_active ?? true,
    });

    setEditingId(company.company_id);
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar empresa?")) return;

    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error(error);
      alert("Error eliminando empresa");
    }
  };

  // 🔥 View Departments
  const handleViewDepartments = async (companyId) => {
    try {
      setLoadingDepartments(true);
      setSelectedCompany(companyId);

      const res = await getDepartmentsByCompany(companyId);
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando departamentos");
    } finally {
      setLoadingDepartments(false);
    }
  };

  // 🔥 DEPARTMENTS HANDLERS
  const handleDeptChange = (e) => {
    setDeptForm({
      ...deptForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...deptForm,
        company_id: selectedCompany,
      };

      if (editingDeptId) {
        await updateDepartment(editingDeptId, payload);
      } else {
        await createDepartment(payload);
      }

      setDeptForm({ department_name: "" });
      setEditingDeptId(null);

      handleViewDepartments(selectedCompany);
    } catch (error) {
      console.error(error);
      alert("Error guardando departamento");
    }
  };

  const handleEditDept = (dept) => {
    setDeptForm({
      department_name: dept.department_name,
    });

    setEditingDeptId(dept.department_id);
  };

  const handleDeleteDept = async (id) => {
    if (!confirm("¿Eliminar departamento?")) return;

    try {
      await deleteDepartment(id);
      handleViewDepartments(selectedCompany);
    } catch (error) {
      console.error(error);
      alert("Error eliminando departamento");
    }
  };

  const resetForm = () => {
    setForm({
      company_name: "",
      company_description: "",
      is_active: true,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">

      <h2 className="text-3xl font-bold mb-6">Companies</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow-md mb-6 flex flex-col gap-4 max-w-lg"
      >
        <input
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />

        <textarea
          name="company_description"
          placeholder="Description"
          value={form.company_description}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <div className="flex gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition">
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No companies found
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.company_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.company_name}</td>
                  <td className="p-3">{c.company_code}</td>
                  <td className="p-3">{c.company_description}</td>
                  <td className="p-3">
                    {c.is_active ? "🟢 Active" : "🔴 Inactive"}
                  </td>

                  <td className="p-3 flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.company_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        handleViewDepartments(c.company_id)
                      }
                      className="text-purple-600 hover:underline"
                    >
                      Departments
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DEPARTMENTS */}
      {selectedCompany && (
        <div className="mt-6 bg-white p-5 rounded-xl shadow-md">

          <h3 className="text-lg font-bold mb-4">
            Departments
          </h3>

          {/* FORM */}
          <form
            onSubmit={handleDeptSubmit}
            className="flex gap-3 mb-4"
          >
            <input
              name="department_name"
              placeholder="Department Name"
              value={deptForm.department_name}
              onChange={handleDeptChange}
              className="border p-2 rounded w-full"
              required
            />

            <button className="bg-purple-600 text-white px-4 rounded">
              {editingDeptId ? "Update" : "Add"}
            </button>
          </form>

          {/* LIST */}
          {loadingDepartments ? (
            <p>Loading...</p>
          ) : departments.length === 0 ? (
            <p>No departments found</p>
          ) : (
            <ul className="space-y-2">
              {departments.map((d) => (
                <li
                  key={d.department_id}
                  className="flex justify-between items-center border p-2 rounded bg-gray-50"
                >
                  <span>
                    {d.department_name} ({d.department_code})
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditDept(d)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteDept(d.department_id)
                      }
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;