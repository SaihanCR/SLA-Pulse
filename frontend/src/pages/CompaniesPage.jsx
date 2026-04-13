import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Layers,
  X,
} from "lucide-react";

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

const emptyForm = {
  company_name: "",
  company_description: "",
  is_active: true,
};

const emptyDeptForm = {
  department_name: "",
};

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeptModal, setShowDeptModal] = useState(false);

  const [deptForm, setDeptForm] = useState(emptyDeptForm);
  const [editingDeptId, setEditingDeptId] = useState(null);

  const fetchCompanies = async () => {
    const res = await getCompanies();
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      company_name: form.company_name,
      company_description: form.company_description,
      is_active: form.is_active,
    };

    if (editingId) {
      await updateCompany(editingId, payload);
    } else {
      await createCompany(payload);
    }

    closeModal();
    fetchCompanies();
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditingId(c.company_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar empresa?")) return;
    await deleteCompany(id);
    fetchCompanies();
  };

  const openDeptModal = async (companyId) => {
    setSelectedCompany(companyId);
    const res = await getDepartmentsByCompany(companyId);
    setDepartments(res.data);
    setShowDeptModal(true);
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...deptForm,
      company_id: selectedCompany,
    };

    if (editingDeptId) {
      await updateDepartment(editingDeptId, payload);
    } else {
      await createDepartment(payload);
    }

    resetDeptForm();
    openDeptModal(selectedCompany);
  };

  const handleEditDept = (d) => {
    setDeptForm(d);
    setEditingDeptId(d.department_id);
  };

  const handleDeleteDept = async (id) => {
    if (!confirm("¿Eliminar departamento?")) return;
    await deleteDepartment(id);
    openDeptModal(selectedCompany);
  };

  const closeModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const closeDeptModal = () => {
    setDeptForm(emptyDeptForm);
    setEditingDeptId(null);
    setShowDeptModal(false);
  };

  const resetDeptForm = () => {
    setDeptForm(emptyDeptForm);
    setEditingDeptId(null);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl text-white">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Companies</h1>
            <p className="text-sm text-gray-500">{companies.length} companies</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center"
        >
          <Plus size={16} />
          New Company
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr key={c.company_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.company_name}</td>
                <td>{c.company_code}</td>
                <td>{c.company_description}</td>

                <td>
                  {c.is_active ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="flex gap-2 p-3">
                  <button onClick={() => handleEdit(c)}>
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => handleDelete(c.company_id)}>
                    <Trash2 size={16} />
                  </button>

                  <button onClick={() => openDeptModal(c.company_id)}>
                    <Layers size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPANY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3>{editingId ? "Edit Company" : "New Company"}</h3>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="company_name"
                placeholder="Name"
                value={form.company_name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <textarea
                name="company_description"
                placeholder="Description"
                value={form.company_description}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <button className="bg-purple-600 text-white w-full p-2 rounded">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h3>Departments</h3>
              <button onClick={closeDeptModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleDeptSubmit} className="flex gap-2 mb-4">
              <input
                name="department_name"
                value={deptForm.department_name}
                onChange={(e) =>
                  setDeptForm({ department_name: e.target.value })
                }
                className="border p-2 flex-1 rounded"
              />
              <button className="bg-purple-600 text-white px-3 rounded">
                Add
              </button>
            </form>

            {departments.map((d) => (
              <div key={d.department_id} className="flex justify-between mb-2">
                <span>{d.department_name}</span>

                <div className="flex gap-2">
                  <button onClick={() => handleEditDept(d)}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDeleteDept(d.department_id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;