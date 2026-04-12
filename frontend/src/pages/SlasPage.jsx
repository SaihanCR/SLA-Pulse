import { useEffect, useMemo, useState } from "react";
import { getCompanies } from "../services/companies.service";
import { getDepartmentsByCompany } from "../services/departments.service";
import {
  getSlasByDepartment,
  createSla,
  updateSla,
  deleteSla,
} from "../services/slas.service";
import { getPriorities } from "../services/priorities.service";

const SlasPage = () => {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [slas, setSlas] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPriorities, setLoadingPriorities] = useState(false);
  const [loadingSlas, setLoadingSlas] = useState(false);

  const [editingSlaId, setEditingSlaId] = useState(null);

  const [form, setForm] = useState({
    sla_title: "",
    priority_id: "",
    sla_hours: "",
    is_active: true,
  });

  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.company_id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);

  const selectedDepartment = useMemo(() => {
    return (
      departments.find((d) => d.department_id === selectedDepartmentId) || null
    );
  }, [departments, selectedDepartmentId]);

  const selectedDepartmentName = useMemo(() => {
    return selectedDepartment?.department_name || "";
  }, [selectedDepartment]);

  const getPriorityName = (priorityId) => {
    const priority = priorities.find((p) => p.priority_id === priorityId);
    return priority ? priority.priority_name : "Sin prioridad";
  };

  const resetForm = () => {
    setForm({
      sla_title: "",
      priority_id: "",
      sla_hours: "",
      is_active: true,
    });
    setEditingSlaId(null);
  };

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const res = await getCompanies();
      setCompanies(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando compañías");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchPriorities = async () => {
    try {
      setLoadingPriorities(true);
      const res = await getPriorities();
      setPriorities(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando prioridades");
    } finally {
      setLoadingPriorities(false);
    }
  };

  const fetchDepartments = async (companyId) => {
    try {
      setLoadingDepartments(true);
      const res = await getDepartmentsByCompany(companyId);
      setDepartments(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando departamentos");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchSlas = async (departmentId) => {
    try {
      setLoadingSlas(true);
      const res = await getSlasByDepartment(departmentId);
      setSlas(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando SLAs");
    } finally {
      setLoadingSlas(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchPriorities();
  }, []);

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;

    setSelectedCompanyId(companyId);
    setSelectedDepartmentId("");
    setDepartments([]);
    setSlas([]);
    resetForm();

    if (!companyId) return;

    await fetchDepartments(companyId);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartmentId(e.target.value);
    setSlas([]);
    resetForm();
  };

  const handleSearch = async () => {
    if (!selectedDepartmentId) {
      alert("Debes seleccionar un departamento");
      return;
    }

    await fetchSlas(selectedDepartmentId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDepartmentId) {
      alert("Debes seleccionar un departamento");
      return;
    }

    const payload = {
      sla_title: form.sla_title,
      priority_id: form.priority_id,
      department_id: selectedDepartmentId,
      sla_hours: Number(form.sla_hours),
      is_active: form.is_active,
    };

    try {
      if (editingSlaId) {
        await updateSla(editingSlaId, payload);
      } else {
        await createSla(payload);
      }

      resetForm();
      await fetchSlas(selectedDepartmentId);
    } catch (error) {
      console.error(error);
      alert("Error guardando SLA");
    }
  };

  const handleEdit = (sla) => {
    setEditingSlaId(sla.sla_id);
    setForm({
      sla_title: sla.sla_title || "",
      priority_id: sla.priority_id || "",
      sla_hours: sla.sla_hours ?? "",
      is_active: sla.is_active ?? true,
    });
  };

  const handleDelete = async (slaId) => {
    const confirmed = window.confirm("¿Eliminar SLA?");
    if (!confirmed) return;

    try {
      await deleteSla(slaId);
      await fetchSlas(selectedDepartmentId);
    } catch (error) {
      console.error(error);
      alert("Error eliminando SLA");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">
      <h2 className="text-3xl font-bold mb-6">SLAs</h2>

      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-2 font-medium">Compañía</label>
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Seleccione una compañía</option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Departamento</label>
            <select
              value={selectedDepartmentId}
              onChange={handleDepartmentChange}
              disabled={!selectedCompanyId || loadingDepartments}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100"
            >
              <option value="">
                {!selectedCompanyId
                  ? "Primero seleccione una compañía"
                  : loadingDepartments
                  ? "Cargando departamentos..."
                  : "Seleccione un departamento"}
              </option>

              {departments.map((department) => (
                <option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleSearch}
              disabled={!selectedDepartmentId || loadingSlas}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
            >
              {loadingSlas ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {(selectedCompany || selectedDepartment) && (
          <div className="mt-4 text-sm text-gray-600">
            {selectedCompany && (
              <p>
                <strong>Compañía:</strong> {selectedCompany.company_name}
              </p>
            )}
            {selectedDepartment && (
              <p>
                <strong>Departamento:</strong> {selectedDepartment.department_name}
              </p>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          {editingSlaId ? "Editar SLA" : "Crear SLA"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Título del SLA</label>
            <input
              name="sla_title"
              placeholder="Ej: Atención crítica"
              value={form.sla_title}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              required
              disabled={!selectedDepartmentId}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Prioridad</label>
            <select
              name="priority_id"
              value={form.priority_id}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              required
              disabled={!selectedDepartmentId || loadingPriorities}
            >
              <option value="">
                {loadingPriorities
                  ? "Cargando prioridades..."
                  : "Seleccione una prioridad"}
              </option>

              {priorities.map((priority) => (
                <option
                  key={priority.priority_id}
                  value={priority.priority_id}
                >
                  {priority.priority_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Horas SLA</label>
            <input
              type="number"
              min="1"
              step="1"
              name="sla_hours"
              placeholder="Ej: 24"
              value={form.sla_hours}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
              required
              disabled={!selectedDepartmentId}
            />
          </div>

          <div className="flex items-center gap-3 mt-8">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={!selectedDepartmentId}
            />
            <label className="font-medium">Activo</label>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={!selectedDepartmentId}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
          >
            {editingSlaId ? "Actualizar" : "Crear"}
          </button>

          {editingSlaId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Prioridad</th>
              <th className="p-3 text-left">Departamento</th>
              <th className="p-3 text-left">Horas</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {!selectedDepartmentId ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Selecciona una compañía, un departamento y pulsa buscar
                </td>
              </tr>
            ) : loadingSlas ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Cargando SLAs...
                </td>
              </tr>
            ) : slas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No se encontraron SLAs
                </td>
              </tr>
            ) : (
              slas.map((sla) => (
                <tr key={sla.sla_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{sla.sla_title}</td>
                  <td className="p-3">{getPriorityName(sla.priority_id)}</td>
                  <td className="p-3">{selectedDepartmentName || "-"}</td>
                  <td className="p-3">{sla.sla_hours}</td>
                  <td className="p-3">
                    {sla.is_active ? "Activo" : "Inactivo"}
                  </td>
                  <td className="p-3 flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleEdit(sla)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(sla.sla_id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(loadingCompanies || loadingPriorities) && (
        <div className="mt-4 text-sm text-gray-500">
          {loadingCompanies && <p>Cargando compañías...</p>}
          {loadingPriorities && <p>Cargando prioridades...</p>}
        </div>
      )}
    </div>
  );
};

export default SlasPage;