import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Eye,
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

/**
 * Formatea una fecha a un texto legible.
 */
const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

/**
 * Determina la presentación visual del SLA.
 * Si el ticket está cerrado, no se aplica resaltado por SLA.
 */
const getSlaStatusMeta = (ticket) => {
  const statusName = ticket?.ticket_statuses?.status_name?.toLowerCase() || "";

  if (
    statusName.includes("finalizado") ||
    statusName.includes("abandonado")
  ) {
    return {
      label: "Cerrado",
      badgeClass: "bg-gray-400 text-white",
      rowClass: "",
    };
  }

  const slaHours = Number(ticket?.slas?.sla_hours);

  if (!slaHours || !ticket?.created_at) {
    return {
      label: "Sin SLA",
      badgeClass: "bg-gray-200 text-gray-700",
      rowClass: "",
    };
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
      badgeClass: "bg-yellow-400 text-white",
      rowClass: "bg-yellow-50",
    };
  }

  return {
    label: "En tiempo",
    badgeClass: "bg-green-500 text-white",
    rowClass: "",
  };
};

/**
 * Asigna color al estado del ticket según su nombre.
 */
const getStatusColor = (statusName = "") => {
  const normalized = statusName.toLowerCase();

  if (normalized.includes("creado")) {
    return "bg-green-100 text-green-700";
  }

  if (normalized.includes("proceso")) {
    return "bg-blue-500 text-white";
  }

  if (normalized.includes("finalizado")) {
    return "bg-gray-500 text-white";
  }

  if (normalized.includes("pendiente")) {
    return "bg-orange-400 text-white";
  }

  if (normalized.includes("abandonado")) {
    return "bg-red-500 text-white";
  }

  return "bg-gray-300 text-gray-800";
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
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  /**
   * Carga los tickets donde el departamento actual es responsable.
   */
  const fetchResponsibleTickets = async () => {
    if (!currentUser?.department_id) return;

    const res = await getTicketsByResponsibleDepartment(
      currentUser.department_id
    );
    setResponsibleTickets(res.data || []);
  };

  /**
   * Carga los tickets donde el departamento actual es solicitante.
   */
  const fetchRequesterTickets = async () => {
    if (!currentUser?.department_id) return;

    const res = await getTicketsByRequesterDepartment(
      currentUser.department_id
    );
    setRequesterTickets(res.data || []);
  };

  /**
   * Carga los estatus disponibles.
   */
  const fetchStatuses = async () => {
    const res = await getTicketStatuses();
    setTicketStatuses(res.data || []);
  };

  /**
   * Carga inicial de datos dependientes de la sesión.
   */
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?.department_id) return;

      try {
        setLoadingTickets(true);
        await Promise.all([
          fetchResponsibleTickets(),
          fetchRequesterTickets(),
          fetchStatuses(),
        ]);
      } catch (error) {
        console.error(error);
        alert("Error cargando información de tickets");
      } finally {
        setLoadingTickets(false);
      }
    };

    loadData();
  }, [currentUser?.department_id]);

  /**
   * Abre el detalle del ticket seleccionado.
   */
  const handleOpenDetail = async (id) => {
    try {
      setLoadingDetail(true);
      const res = await getTicketDetail(id);
      setSelectedTicketDetail(res.data);
      setEditingStatusId(res.data?.ticket?.status_id || "");
    } catch (error) {
      console.error(error);
      alert("Error cargando detalle del ticket");
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * Cierra el modal de detalle.
   */
  const handleCloseDetail = () => {
    setSelectedTicketDetail(null);
    setEditingStatusId("");
  };

  /**
   * Guarda el nuevo estatus del ticket seleccionado.
   */
  const handleSaveStatus = async () => {
    if (!selectedTicketDetail?.ticket?.ticket_id) return;

    try {
      setSavingStatus(true);

      await updateTicket(selectedTicketDetail.ticket.ticket_id, {
        status_id: editingStatusId,
      });

      await handleOpenDetail(selectedTicketDetail.ticket.ticket_id);
      await fetchResponsibleTickets();
      await fetchRequesterTickets();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error actualizando ticket");
    } finally {
      setSavingStatus(false);
    }
  };

  const tickets =
    activeTab === "responsible" ? responsibleTickets : requesterTickets;

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tickets</h1>
          <p className="text-gray-500">
            No hay una sesión activa. Inicia sesión para consultar los tickets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
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

      {/* Tabs */}
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

      {/* Tabla */}
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
            {loadingTickets ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Cargando tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No se encontraron tickets
                </td>
              </tr>
            ) : (
              tickets.map((t) => {
                const sla = getSlaStatusMeta(t);

                return (
                  <tr key={t.ticket_id} className={sla.rowClass}>
                    <td className="p-3">{t.ticket_code}</td>
                    <td>{t.ticket_title}</td>

                    <td>
                      <span
                        className={`${getStatusColor(
                          t.ticket_statuses?.status_name
                        )} px-2 py-1 rounded text-xs font-medium`}
                      >
                        {t.ticket_statuses?.status_name}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${sla.badgeClass} px-2 py-1 rounded text-xs`}
                      >
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h3>Detalle</h3>
              <button onClick={handleCloseDetail}>
                <X />
              </button>
            </div>

            {loadingDetail ? (
              <p className="text-gray-500">Cargando detalle...</p>
            ) : (
              <>
                <p>
                  <strong>{selectedTicketDetail.ticket.ticket_title}</strong>
                </p>

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
                  disabled={savingStatus}
                  className="bg-purple-600 text-white mt-3 px-3 py-1 rounded disabled:opacity-60"
                >
                  {savingStatus ? "Actualizando..." : "Actualizar"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de creación */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={async () => {
          await fetchResponsibleTickets();
          await fetchRequesterTickets();
        }}
      />
    </div>
  );
};

export default TicketsPage;