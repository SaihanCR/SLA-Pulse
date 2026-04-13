import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Eye,
  Clock3,
  CircleAlert,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

import {
  getTicketDetail,
  getTicketsByResponsibleDepartment,
  getTicketsByRequesterDepartment,
  updateTicket,
} from "../services/tickets.service";

import { getTicketStatuses } from "../services/ticketStatuses.service";
import { getCurrentUser } from "../services/currentUser.service";

import CreateTicketModal from "../components/CreateTicketModal";

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const formatDuration = (ms) => {
  const absMs = Math.abs(ms);
  const totalMinutes = Math.floor(absMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const getSlaStatusMeta = (ticket) => {
  const slaHours = Number(ticket?.slas?.sla_hours);

  if (!slaHours || !ticket?.created_at) {
    return { label: "Sin SLA", badgeClass: "bg-gray-200", rowClass: "" };
  }

  const createdAt = new Date(ticket.created_at).getTime();
  const totalMs = slaHours * 3600000;
  const remaining = createdAt + totalMs - Date.now();
  const ratio = remaining / totalMs;

  if (remaining <= 0) {
    return {
      label: "Vencido",
      badgeClass: "bg-red-500 text-white",
      rowClass: "bg-red-50",
    };
  }

  if (ratio <= 0.3) {
    return {
      label: "Por vencer",
      badgeClass: "bg-yellow-400",
      rowClass: "bg-yellow-50",
    };
  }

  return {
    label: "En tiempo",
    badgeClass: "bg-green-500 text-white",
    rowClass: "",
  };
};

const TicketsPage = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [activeTab, setActiveTab] = useState("responsible");
  const [responsibleTickets, setResponsibleTickets] = useState([]);
  const [requesterTickets, setRequesterTickets] = useState([]);

  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState("");
  const [ticketStatuses, setTicketStatuses] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchResponsibleTickets = async () => {
    const res = await getTicketsByResponsibleDepartment(
      currentUser.department_id
    );
    setResponsibleTickets(res.data || []);
  };

  const fetchRequesterTickets = async () => {
    const res = await getTicketsByRequesterDepartment(
      currentUser.department_id
    );
    setRequesterTickets(res.data || []);
  };

  const fetchStatuses = async () => {
    const res = await getTicketStatuses();
    setTicketStatuses(res.data || []);
  };

  useEffect(() => {
    fetchResponsibleTickets();
    fetchRequesterTickets();
    fetchStatuses();
  }, []);

  const handleOpenDetail = async (id) => {
    const res = await getTicketDetail(id);
    setSelectedTicketDetail(res.data);
    setEditingStatusId(res.data.ticket.status_id);
  };

  const handleSaveStatus = async () => {
    await updateTicket(selectedTicketDetail.ticket.ticket_id, {
      status_id: editingStatusId,
    });

    await handleOpenDetail(selectedTicketDetail.ticket.ticket_id);
    fetchResponsibleTickets();
    fetchRequesterTickets();
  };

  const tickets =
    activeTab === "responsible" ? responsibleTickets : requesterTickets;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="bg-purple-600 p-2 rounded-xl text-white">
            <Ticket size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Tickets</h1>
            <p className="text-sm text-gray-500">
              {tickets.length} registros
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("responsible")}
          className={`px-4 py-2 rounded ${
            activeTab === "responsible"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Responsables
        </button>

        <button
          onClick={() => setActiveTab("requester")}
          className={`px-4 py-2 rounded ${
            activeTab === "requester"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Solicitados
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Código</th>
              <th>Título</th>
              <th>Estado</th>
              <th>SLA</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => {
              const sla = getSlaStatusMeta(t);

              return (
                <tr key={t.ticket_id} className={sla.rowClass}>
                  <td className="p-3">{t.ticket_code}</td>
                  <td>{t.ticket_title}</td>

                  <td>
                    <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                      {t.ticket_statuses?.status_name}
                    </span>
                  </td>

                  <td>
                    <span className={`${sla.badgeClass} px-2 py-1 rounded text-xs`}>
                      {sla.label}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleOpenDetail(t.ticket_id)}
                      className="text-purple-600"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6">

            <div className="flex justify-between mb-4">
              <h3>Detalle</h3>
              <button onClick={() => setSelectedTicketDetail(null)}>
                <X />
              </button>
            </div>

            <p><strong>{selectedTicketDetail.ticket.ticket_title}</strong></p>

            <select
              value={editingStatusId}
              onChange={(e) => setEditingStatusId(e.target.value)}
              className="border p-2 mt-3"
            >
              {ticketStatuses.map((s) => (
                <option key={s.status_id} value={s.status_id}>
                  {s.status_name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveStatus}
              className="bg-purple-600 text-white mt-3 px-3 py-1 rounded"
            >
              Actualizar
            </button>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchResponsibleTickets}
      />
    </div>
  );
};

export default TicketsPage;