import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { getCompanies } from "../services/companies.service";
import { getDepartmentsByCompany } from "../services/departments.service";
import {
  getSlasByDepartment,
  createSla,
  updateSla,
  deleteSla,
} from "../services/slas.service";
import { getPriorities } from "../services/priorities.service";

const emptyForm = {
  sla_title: "",
  priority_id: "",
  sla_hours: "",
  is_active: true,
};

const SlasPage = () => {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [slas, setSlas] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [editingSlaId, setEditingSlaId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const selectedDepartment = useMemo(() => {
    return departments.find((d) => d.department_id === selectedDepartmentId);
  }, [departments, selectedDepartmentId]);

  const getPriorityName = (id) =>
    priorities.find((p) => p.priority_id === id)?.priority_name ||
    "Sin prioridad";

  const fetchCompanies = async () => {
    const res = await getCompanies();
    setCompanies(res.data || []);
  };

  const fetchPriorities = async () => {
    const res = await getPriorities();
    setPriorities(res.data || []);
  };

  const fetchDepartments = async (companyId) => {
    const res = await getDepartmentsByCompany(companyId);
    setDepartments(res.data || []);
  };

  const fetchSlas = async (departmentId) => {
    const res = await getSlasByDepartment(departmentId);
    setSlas(res.data || []);
  };

  useEffect(() => {
    fetchCompanies();
    fetchPriorities();
  }, []);

  const handleCompanyChange = async (e) => {
    const id = e.target.value;
    setSelectedCompanyId(id);
    setSelectedDepartmentId("");
    setDepartments([]);
    setSlas([]);

    if (id) await fetchDepartments(id);
  };

  const handleSearch = async () => {
    if (!selectedDepartmentId) return alert("Selecciona un departamento");
    await fetchSlas(selectedDepartmentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      department_id: selectedDepartmentId,
      sla_hours: Number(form.sla_hours),
    };

    if (editingSlaId) {
      await updateSla(editingSlaId, payload);
    } else {
      await createSla(payload);
    }

    closeModal();
    fetchSlas(selectedDepartmentId);
  };

  const handleEdit = (sla) => {
    setForm(sla);
    setEditingSlaId(sla.sla_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar SLA?")) return;
    await deleteSla(id);
    fetchSlas(selectedDepartmentId);
  };

  const closeModal = () => {
    setForm(emptyForm);
    setEditingSlaId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="bg-purple-600 p-2 rounded-xl text-white">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SLAs</h1>
            <p className="text-sm text-gray-500">{slas.length} registros</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedDepartmentId}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center disabled:bg-gray-400"
        >
          <Plus size={16} />
          New SLA
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="grid md:grid-cols-3 gap-4">

          <select
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccione compañía</option>
            {companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>
                {c.company_name}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartmentId}
            onChange={(e) => setSelectedDepartmentId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccione departamento</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white rounded"
          >
            Buscar
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th>Prioridad</th>
              <th>Horas</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {slas.map((sla) => (
              <tr key={sla.sla_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{sla.sla_title}</td>
                <td>{getPriorityName(sla.priority_id)}</td>
                <td>{sla.sla_hours}h</td>

                <td>
                  {sla.is_active ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="flex gap-2 p-3">
                  <button onClick={() => handleEdit(sla)}>
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => handleDelete(sla.sla_id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h3>{editingSlaId ? "Editar SLA" : "Nuevo SLA"}</h3>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="sla_title"
                placeholder="Título"
                value={form.sla_title}
                onChange={(e) =>
                  setForm({ ...form, sla_title: e.target.value })
                }
                className="border p-2 w-full rounded"
              />

              <select
                value={form.priority_id}
                onChange={(e) =>
                  setForm({ ...form, priority_id: e.target.value })
                }
                className="border p-2 w-full rounded"
              >
                <option value="">Seleccione prioridad</option>
                {priorities.map((p) => (
                  <option key={p.priority_id} value={p.priority_id}>
                    {p.priority_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Horas SLA"
                value={form.sla_hours}
                onChange={(e) =>
                  setForm({ ...form, sla_hours: e.target.value })
                }
                className="border p-2 w-full rounded"
              />

              <button className="bg-purple-600 text-white w-full p-2 rounded">
                Guardar
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlasPage;