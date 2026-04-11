import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
} from "../services/departments.service";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    department_name: "",
    department_area: "",
    company_id: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Load
  const fetchDepartments = async () => {
    const res = await getDepartments();
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Search
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value) return fetchDepartments();

    const res = await searchDepartments(value);
    setDepartments(res.data);
  };

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateDepartment(editingId, form);
    } else {
      await createDepartment(form);
    }

    resetForm();
    fetchDepartments();
  };

  // Edit
  const handleEdit = (dep) => {
    setForm(dep);
    setEditingId(dep.department_id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar departamento?")) return;

    await deleteDepartment(id);
    fetchDepartments();
  };

  const resetForm = () => {
    setForm({
      department_name: "",
      department_area: "",
      company_id: "",
      is_active: true,
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Departments</h2>

        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded-xl mb-6 flex gap-3 flex-wrap"
      >
        <input
          name="department_name"
          placeholder="Name"
          value={form.department_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="department_area"
          placeholder="Area"
          value={form.department_area}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="company_id"
          placeholder="Company ID"
          value={form.company_id}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          Active
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
        </label>

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>Code</th>
              <th>Area</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dep) => (
              <tr key={dep.department_id} className="border-t">
                <td className="p-3">{dep.department_name}</td>
                <td>{dep.department_code}</td>
                <td>{dep.department_area}</td>
                <td>
                  {dep.is_active ? "Active" : "Inactive"}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(dep)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dep.department_id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentsPage;