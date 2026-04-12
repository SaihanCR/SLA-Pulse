import { useEffect, useMemo, useState } from "react";
import {
  getTicketDetail,
  getTicketsByResponsibleDepartment,
  getTicketsByRequesterDepartment,
  updateTicket,
} from "../services/tickets.service";
import { getTicketStatuses } from "../services/ticketStatuses.service";
import { getCurrentUser } from "../services/currentUser.service";

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const formatDuration = (ms) => {
  const absMs = Math.abs(ms);
  const totalMinutes = Math.floor(absMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
};

const getSlaStatusMeta = (ticket) => {
  const slaHours = Number(ticket?.slas?.sla_hours);

  if (!slaHours || !ticket?.created_at) {
    return {
      label: "Sin SLA",
      badgeClass: "bg-gray-100 text-gray-700",
      rowClass: "",
    };
  }

  const createdAt = new Date(ticket.created_at).getTime();
  const totalMs = slaHours * 60 * 60 * 1000;
  const dueAt = createdAt + totalMs;
  const now = Date.now();
  const remainingMs = dueAt - now;
  const ratio = remainingMs / totalMs;

  if (remainingMs <= 0) {
    return {
      label: `Vencido hace ${formatDuration(remainingMs)}`,
      badgeClass: "bg-red-100 text-red-700",
      rowClass: "bg-red-50",
    };
  }

  if (ratio <= 0.2) {
    return {
      label: `Crítico · ${formatDuration(remainingMs)} restantes`,
      badgeClass: "bg-red-100 text-red-700",
      rowClass: "bg-red-50",
    };
  }

  if (ratio <= 0.5) {
    return {
      label: `Por vencer · ${formatDuration(remainingMs)} restantes`,
      badgeClass: "bg-yellow-100 text-yellow-700",
      rowClass: "bg-yellow-50",
    };
  }

  return {
    label: `${formatDuration(remainingMs)} restantes`,
    badgeClass: "bg-green-100 text-green-700",
    rowClass: "",
  };
};

const TicketsPage = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [activeTab, setActiveTab] = useState("responsible");

  const [responsibleTickets, setResponsibleTickets] = useState([]);
  const [requesterTickets, setRequesterTickets] = useState([]);

  const [loadingResponsible, setLoadingResponsible] = useState(false);
  const [loadingRequester, setLoadingRequester] = useState(false);

  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [ticketStatuses, setTicketStatuses] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchResponsibleTickets = async () => {
    try {
      setLoadingResponsible(true);
      const res = await getTicketsByResponsibleDepartment(
        currentUser.department_id
      );
      setResponsibleTickets(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando tickets asignados a tu departamento");
    } finally {
      setLoadingResponsible(false);
    }
  };

  const fetchRequesterTickets = async () => {
    try {
      setLoadingRequester(true);
      const res = await getTicketsByRequesterDepartment(
        currentUser.department_id
      );
      setRequesterTickets(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando tickets solicitados por tu departamento");
    } finally {
      setLoadingRequester(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await getTicketStatuses();
      setTicketStatuses(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando estatus de tickets");
    }
  };

  useEffect(() => {
    fetchResponsibleTickets();
    fetchRequesterTickets();
    fetchStatuses();
  }, []);

  const handleOpenDetail = async (ticketId) => {
    try {
      setLoadingDetail(true);
      const res = await getTicketDetail(ticketId);
      setSelectedTicketDetail(res.data);
      setEditingStatusId(res.data?.ticket?.status_id || "");
    } catch (error) {
      console.error(error);
      alert("Error cargando detalle del ticket");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedTicketDetail(null);
    setEditingStatusId("");
  };

  const handleSaveStatus = async () => {
    if (!selectedTicketDetail?.ticket?.ticket_id) return;
    if (!editingStatusId) {
      alert("Debes seleccionar un estatus");
      return;
    }

    try {
      setSavingStatus(true);

      await updateTicket(selectedTicketDetail.ticket.ticket_id, {
        status_id: editingStatusId,
      });

      const detailRes = await getTicketDetail(selectedTicketDetail.ticket.ticket_id);
      setSelectedTicketDetail(detailRes.data);
      setEditingStatusId(detailRes.data?.ticket?.status_id || "");

      await fetchResponsibleTickets();
      await fetchRequesterTickets();

      alert("Estatus actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error actualizando estatus");
    } finally {
      setSavingStatus(false);
    }
  };

  const ticketsToShow =
    activeTab === "responsible" ? responsibleTickets : requesterTickets;

  const isLoading =
    activeTab === "responsible" ? loadingResponsible : loadingRequester;

  const canEditCurrentTicket = activeTab === "responsible";

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-3xl font-bold">Tickets</h2>
        <p className="text-sm text-gray-600">
          Vista preparada para sesión futura. Actualmente usa usuario mock:
          <span className="font-semibold"> {currentUser.full_name}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab("responsible")}
            className={`px-4 py-2 rounded transition ${
              activeTab === "responsible"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Asignados a mi departamento
          </button>

          <button
            onClick={() => setActiveTab("requester")}
            className={`px-4 py-2 rounded transition ${
              activeTab === "requester"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Solicitados por mi departamento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Compañía</th>
              <th className="p-3 text-left">Prioridad</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">SLA</th>
              <th className="p-3 text-left">Creado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Cargando tickets...
                </td>
              </tr>
            ) : ticketsToShow.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No se encontraron tickets
                </td>
              </tr>
            ) : (
              ticketsToShow.map((ticket) => {
                const slaMeta = getSlaStatusMeta(ticket);

                return (
                  <tr
                    key={ticket.ticket_id}
                    className={`border-t hover:bg-gray-50 ${slaMeta.rowClass}`}
                  >
                    <td className="p-3 font-medium">{ticket.ticket_code}</td>
                    <td className="p-3">{ticket.ticket_title}</td>
                    <td className="p-3">
                      {ticket.companies?.company_name || "-"}
                    </td>
                    <td className="p-3">
                      {ticket.priorities?.priority_name || "-"}
                    </td>
                    <td className="p-3">
                      {ticket.ticket_statuses?.status_name || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span>{ticket.slas?.sla_title || "-"}</span>
                        <span
                          className={`inline-block w-fit px-2 py-1 rounded-full text-xs font-medium ${slaMeta.badgeClass}`}
                        >
                          {slaMeta.label}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{formatDateTime(ticket.created_at)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpenDetail(ticket.ticket_id)}
                        className="text-purple-600 hover:underline"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {(selectedTicketDetail || loadingDetail) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold">Detalle del Ticket</h3>
              <button
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6">
              {loadingDetail ? (
                <p>Cargando detalle...</p>
              ) : selectedTicketDetail ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <p className="text-sm text-gray-500">Código</p>
                      <p className="font-semibold">
                        {selectedTicketDetail.ticket.ticket_code}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Título</p>
                      <p className="font-semibold">
                        {selectedTicketDetail.ticket.ticket_title}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Compañía</p>
                      <p>
                        {selectedTicketDetail.ticket.companies?.company_name ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Prioridad</p>
                      <p>
                        {selectedTicketDetail.ticket.priorities?.priority_name ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Estado actual</p>
                      <p>
                        {selectedTicketDetail.ticket.ticket_statuses
                          ?.status_name || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">SLA</p>
                      <p>
                        {selectedTicketDetail.ticket.slas?.sla_title || "-"}{" "}
                        {selectedTicketDetail.ticket.slas?.sla_hours
                          ? `(${selectedTicketDetail.ticket.slas.sla_hours}h)`
                          : ""}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Descripción</p>
                      <p>
                        {selectedTicketDetail.ticket.ticket_description || "-"}
                      </p>
                    </div>
                  </div>

                  {canEditCurrentTicket && (
                    <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold mb-4 text-purple-800">
                        Editar estatus
                      </h4>

                      <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                        <div className="w-full md:max-w-sm">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Nuevo estatus
                          </label>
                          <select
                            value={editingStatusId}
                            onChange={(e) => setEditingStatusId(e.target.value)}
                            className="w-full border p-2 rounded"
                          >
                            <option value="">Seleccione un estatus</option>
                            {ticketStatuses
                              .filter(
                                (status, index, arr) =>
                                  index === arr.findIndex((s) => s.status_id === status.status_id)
                              )
                              .map((status) => (
                                <option
                                  key={status.status_id}
                                  value={status.status_id}
                                >
                                  {status.status_name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <button
                          onClick={handleSaveStatus}
                          disabled={savingStatus}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
                        >
                          {savingStatus ? "Guardando..." : "Actualizar estatus"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold mb-4">
                      Historial de cambios
                    </h4>

                    {selectedTicketDetail.tracking?.length === 0 ? (
                      <p className="text-gray-500">
                        No hay historial disponible
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedTicketDetail.tracking.map((item, index) => (
                          <div
                            key={`${item.tracking_id}-${item.created_at || "no-date"}-${index}`}
                            className="border rounded-lg p-4 bg-gray-50"
                            >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p>{formatDateTime(item.created_at)}</p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Estatus</p>
                                <p>
                                  {item.statuses?.status_name ||
                                    item.status_id ||
                                    "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Usuario asignado
                                </p>
                                <p>
                                  {item.users?.full_name ||
                                    item.users?.user_name ||
                                    item.assigned_user_id ||
                                    "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Inicio / Fin
                                </p>
                                <p>
                                  {formatDateTime(item.started_at)} /{" "}
                                  {formatDateTime(item.finished_at)}
                                </p>
                              </div>

                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Motivo</p>
                                <p>{item.reason || "-"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;