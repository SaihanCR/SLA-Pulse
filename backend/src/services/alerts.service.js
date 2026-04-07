import alertsRepository from "../repositories/alerts.repository.js";
import ticketsRepository from "../repositories/tickets.repository.js";
import slasRepository from "../repositories/slas.repository.js";

class AlertsService {

  async evaluateTicket(ticket) {

    console.log("------ EVALUANDO TICKET ------");
    console.log("Ticket ID:", ticket.ticket_id);

    const now = new Date();
    const createdAt = new Date(ticket.created_at);

    // Obtener SLA
    const sla = await slasRepository.getById(ticket.sla_id);
    console.log("SLA:", sla);

    if (!sla) {
      console.log("❌ SLA no encontrado");
      return;
    }

    const totalHours = sla.sla_hours;
    console.log("Total Hours:", totalHours);

    const totalMs = totalHours * 60 * 60 * 1000;

    const deadline = new Date(createdAt.getTime() + totalMs);
    const remainingMs = deadline - now;

    const threshold = totalMs * 0.3;

    console.log("Remaining (ms):", remainingMs);
    console.log("Threshold (ms):", threshold);

    // 🔴 ALERTA CRÍTICA (SLA vencido)
    if (remainingMs <= 0) {

      console.log("🔥 SLA VENCIDO → ALERTA CRÍTICA");

      const existing = await alertsRepository.findActiveByTicketAndSeverity(
        ticket.ticket_id,
        "high"
      );

      if (existing) {
        console.log("⚠️ Ya existe alerta CRITICAL activa");
        return;
      }

      const alert = await alertsRepository.create({
        ticket_id: ticket.ticket_id,
        priority_id: ticket.priority_id,
        message: "SLA incumplido",
        severity: "high",
        status: "active"
      });

      console.log("✅ ALERTA CRÍTICA CREADA:", alert);
      return alert;
    }

    // 🟡 ALERTA WARNING (30%)
    if (remainingMs <= threshold) {

      console.log("⚠️ SLA en 30% restante");

      const existing = await alertsRepository.findActiveByTicketAndSeverity(
        ticket.ticket_id,
        "medium"
      );

      if (existing) {
        console.log("⚠️ Ya existe alerta WARNING activa");
        return;
      }

      const alert = await alertsRepository.create({
        ticket_id: ticket.ticket_id,
        priority_id: ticket.priority_id,
        message: "El ticket está en su 30% final",
        severity: "medium",
        status: "active"
      });

      console.log("✅ ALERTA WARNING CREADA:", alert);
      return alert;
    }

    console.log("ℹ️ No cumple condición de alerta");
  }

  async runEngine() {

    console.log("========== EJECUTANDO ALERT ENGINE ==========");

    const tickets = await ticketsRepository.getAll();

    console.log("Tickets encontrados:", tickets.length);

    for (const ticket of tickets) {
      await this.evaluateTicket(ticket);
    }

    console.log("========== FIN ALERT ENGINE ==========");

    return { message: "Alert Engine ejecutado" };
  }
}

export default new AlertsService();