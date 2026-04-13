import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../services/companies.service";
import { getDepartmentsByCompany } from "../services/departments.service";
import { getPriorities } from "../services/priorities.service";
import { getSlasByDepartment } from "../services/slas.service";
import { getTicketStatuses } from "../services/ticketStatuses.service";
import { createTicket } from "../services/tickets.service";
import { getCurrentUser } from "../services/currentUser.service";

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departmentSlas, setDepartmentSlas] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingSlas, setLoadingSlas] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_id: currentUser.company_id || "",
    requester_department_id: currentUser.department_id || "",
    responsible_department_id: "",
    priority_id: "",
    status_id: "",
    sla_id: "",
    ticket_title: "",
    ticket_description: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [companiesRes, prioritiesRes, statusesRes] = await Promise.all([
          getCompanies(),
          getPriorities(),
          getTicketStatuses(),
        ]);

        setCompanies(companiesRes.data || []);
        setPriorities(prioritiesRes.data || []);
        setStatuses(statusesRes.data || []);
      } catch (error) {
        console.error(error);
        alert(
          "Error cargando catálogos iniciales. Verifica companies, priorities y ticket-statuses."
        );
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      if (!form.company_id) {
        setDepartments([]);
        return;
      }

      try {
        setLoadingDepartments(true);
        const res = await getDepartmentsByCompany(form.company_id);
        const departmentList = res.data || [];
        setDepartments(departmentList);

        const currentUserDepartmentExists = departmentList.some(
          (d) => d.department_id === currentUser.department_id
        );

        if (
          currentUserDepartmentExists &&
          (!form.requester_department_id ||
            form.requester_department_id === currentUser.department_id)
        ) {
          setForm((prev) => ({
            ...prev,
            requester_department_id: currentUser.department_id,
          }));
        }
      } catch (error) {
        console.error(error);
        alert("Error cargando departamentos");
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [form.company_id]);

  useEffect(() => {
    const loadSlas = async () => {
      if (!form.responsible_department_id) {
        setDepartmentSlas([]);
        setForm((prev) => ({ ...prev, sla_id: "" }));
        return;
      }

      try {
        setLoadingSlas(true);
        const res = await getSlasByDepartment(form.responsible_department_id);
        setDepartmentSlas(res.data || []);
      } catch (error) {
        console.error(error);
        alert("Error cargando SLAs del departamento");
      } finally {
        setLoadingSlas(false);
      }
    };

    loadSlas();
  }, [form.responsible_department_id]);

  const filteredSlas = useMemo(() => {
    if (!form.priority_id) return [];
    return departmentSlas.filter((sla) => sla.priority_id === form.priority_id);
  }, [departmentSlas, form.priority_id]);

  useEffect(() => {
    if (
      form.sla_id &&
      !filteredSlas.some((sla) => sla.sla_id === form.sla_id)
    ) {
      setForm((prev) => ({ ...prev, sla_id: "" }));
    }
  }, [filteredSlas, form.sla_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "company_id") {
        next.requester_department_id = "";
        next.responsible_department_id = "";
        next.priority_id = "";
        next.sla_id = "";
      }

      if (name === "responsible_department_id") {
        next.sla_id = "";
      }

      if (name === "priority_id") {
        next.sla_id = "";
      }

      return next;
    });
  };

  const selectedSla = filteredSlas.find((sla) => sla.sla_id === form.sla_id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      created_by_user_id: currentUser.user_id,
    };

    try {
      setSaving(true);
      await createTicket(payload);
      alert("Ticket creado correctamente");
      navigate("/tickets");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Error creando ticket"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-3xl font-bold">Crear Ticket</h2>
        <p className="text-sm text-gray-600">
          Preparado para sesión futura. Actualmente usa usuario mock:
          <span className="font-semibold"> {currentUser.full_name}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Compañía</label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
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
            <label className="block mb-2 font-medium">
              Departamento solicitante
            </label>
            <select
              name="requester_department_id"
              value={form.requester_department_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!form.company_id || loadingDepartments}
            >
              <option value="">
                {!form.company_id
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
            <label className="block mb-2 font-medium">
              Departamento responsable
            </label>
            <select
              name="responsible_department_id"
              value={form.responsible_department_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!form.company_id || loadingDepartments}
            >
              <option value="">
                {!form.company_id
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
            <label className="block mb-2 font-medium">Prioridad</label>
            <select
              name="priority_id"
              value={form.priority_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Seleccione una prioridad</option>
              {priorities.map((priority) => (
                <option key={priority.priority_id} value={priority.priority_id}>
                  {priority.priority_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Estatus inicial</label>
            <select
              name="status_id"
              value={form.status_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Seleccione un estatus</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">SLA</label>
            <select
              name="sla_id"
              value={form.sla_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={
                !form.responsible_department_id ||
                !form.priority_id ||
                loadingSlas
              }
            >
              <option value="">
                {!form.responsible_department_id || !form.priority_id
                  ? "Seleccione departamento responsable y prioridad"
                  : loadingSlas
                  ? "Cargando SLAs..."
                  : "Seleccione un SLA"}
              </option>

              {filteredSlas.map((sla) => (
                <option key={sla.sla_id} value={sla.sla_id}>
                  {sla.sla_title} - {sla.sla_hours}h
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Título</label>
            <input
              name="ticket_title"
              value={form.ticket_title}
              onChange={handleChange}
              placeholder="Escribe el título del ticket"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Descripción</label>
            <textarea
              name="ticket_description"
              value={form.ticket_description}
              onChange={handleChange}
              placeholder="Describe el requerimiento o incidente"
              className="w-full border p-2 rounded min-h-[120px]"
            />
          </div>
        </div>

        {selectedSla && (
          <div className="mt-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
            <p className="font-semibold text-purple-700">SLA seleccionado</p>
            <p className="text-sm text-gray-700">
              {selectedSla.sla_title} · {selectedSla.sla_hours} horas
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition disabled:bg-gray-400"
          >
            {saving ? "Guardando..." : "Crear ticket"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketPage;