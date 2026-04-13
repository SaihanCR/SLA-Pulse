import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { getCompanies } from "../services/companies.service";
import { getDepartmentsByCompany } from "../services/departments.service";
import { getPriorities } from "../services/priorities.service";
import { getSlasByDepartment } from "../services/slas.service";
import { getTicketStatuses } from "../services/ticketStatuses.service";
import { createTicket } from "../services/tickets.service";
import { getCurrentUser } from "../services/currentUser.service";

const CreateTicketModal = ({ isOpen, onClose, onSuccess }) => {
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
    if (!isOpen) return;

    const loadData = async () => {
      const [c, p, s] = await Promise.all([
        getCompanies(),
        getPriorities(),
        getTicketStatuses(),
      ]);

      setCompanies(c.data || []);
      setPriorities(p.data || []);
      setStatuses(s.data || []);
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (!form.company_id) return;

    const loadDepartments = async () => {
      setLoadingDepartments(true);
      const res = await getDepartmentsByCompany(form.company_id);
      setDepartments(res.data || []);
      setLoadingDepartments(false);
    };

    loadDepartments();
  }, [form.company_id]);

  useEffect(() => {
    if (!form.responsible_department_id) return;

    const loadSlas = async () => {
      setLoadingSlas(true);
      const res = await getSlasByDepartment(form.responsible_department_id);
      setDepartmentSlas(res.data || []);
      setLoadingSlas(false);
    };

    loadSlas();
  }, [form.responsible_department_id]);

  const filteredSlas = useMemo(() => {
    return departmentSlas.filter(
      (sla) => sla.priority_id === form.priority_id
    );
  }, [departmentSlas, form.priority_id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await createTicket({
        ...form,
        created_by_user_id: currentUser.user_id,
      });

      alert("Ticket creado correctamente");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creando ticket");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Nuevo Ticket</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Compañía</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </select>

            <select
              name="requester_department_id"
              value={form.requester_department_id}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={!form.company_id || loadingDepartments}
            >
              <option>Departamento solicitante</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              name="responsible_department_id"
              value={form.responsible_department_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option>Departamento responsable</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              name="priority_id"
              value={form.priority_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option>Prioridad</option>
              {priorities.map((p) => (
                <option key={p.priority_id} value={p.priority_id}>
                  {p.priority_name}
                </option>
              ))}
            </select>

            <select
              name="status_id"
              value={form.status_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option>Estatus</option>
              {statuses.map((s) => (
                <option key={s.status_id} value={s.status_id}>
                  {s.status_name}
                </option>
              ))}
            </select>

            <select
              name="sla_id"
              value={form.sla_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              disabled={!form.priority_id || loadingSlas}
            >
              <option>SLA</option>
              {filteredSlas.map((sla) => (
                <option key={sla.sla_id} value={sla.sla_id}>
                  {sla.sla_title} ({sla.sla_hours}h)
                </option>
              ))}
            </select>

          </div>

          <input
            name="ticket_title"
            value={form.ticket_title}
            onChange={handleChange}
            placeholder="Título"
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="ticket_description"
            value={form.ticket_description}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border p-2 rounded"
          />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;