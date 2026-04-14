import alertsRepository from "../repositories/alerts.repository.js";
import ticketsRepository from "../repositories/tickets.repository.js";
import slasRepository from "../repositories/slas.repository.js";

class AlertsService {

  async evaluateTicket(ticket) {
    // Tomar el nombre del estado si viene expandido
    const statusName =
      ticket.ticket_statuses?.status_name ||
      ticket.status_name ||
      null;

    // Estados que cierran la alerta
    const closedStatuses = ["Finalizado", "Abandonado"];

    // Si el ticket ya no está operativo, cerrar alertas y salir
    if (closedStatuses.includes(statusName)) {
      await alertsRepository.resolveByTicketAndSeverity(ticket.ticket_id, "high");
      await alertsRepository.resolveByTicketAndSeverity(ticket.ticket_id, "medium");
      return;
    }

    const now = new Date();
    const createdAt = new Date(ticket.created_at);

    const sla = await slasRepository.getById(ticket.sla_id);

    if (!sla) return;

    const totalMs = sla.sla_hours * 60 * 60 * 1000;
    const deadline = new Date(createdAt.getTime() + totalMs);
    const remainingMs = deadline - now;
    const threshold = totalMs * 0.3;

    // CRÍTICO
    if (remainingMs <= 0) {
      const existing = await alertsRepository.findActiveByTicketAndSeverity(
        ticket.ticket_id,
        "high"
      );

      if (!existing) {
        await alertsRepository.create({
          ticket_id: ticket.ticket_id,
          priority_id: ticket.priority_id,
          message: "SLA incumplido",
          severity: "high",
          status: "active",
        });
      }

      return;
    }

    // WARNING
    if (remainingMs <= threshold) {
      const existing = await alertsRepository.findActiveByTicketAndSeverity(
        ticket.ticket_id,
        "medium"
      );

      if (!existing) {
        await alertsRepository.create({
          ticket_id: ticket.ticket_id,
          priority_id: ticket.priority_id,
          message: "El ticket está en su 30% final",
          severity: "medium",
          status: "active",
        });
      }

      await alertsRepository.resolveByTicketAndSeverity(ticket.ticket_id, "high");
      return;
    }

    // NORMAL → cerrar todo
    await alertsRepository.resolveByTicketAndSeverity(ticket.ticket_id, "high");
    await alertsRepository.resolveByTicketAndSeverity(ticket.ticket_id, "medium");
}

  async runEngine() {
    const tickets = await ticketsRepository.getAllForAlerts();

    for (const ticket of tickets) {
      await this.evaluateTicket(ticket);
    }

    return { message: "Alert Engine ejecutado" };
  }

  async getActiveAlerts() {
    return await alertsRepository.getActiveAlerts();
  }

  async getAllAlerts() {
    return await alertsRepository.getAllAlerts();
  }
}

export default new AlertsService();