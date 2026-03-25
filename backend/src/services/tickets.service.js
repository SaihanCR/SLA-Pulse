// services/tickets.service.js
import ticketsRepository from "../repositories/tickets.repository.js";

class TicketsService {

  async getAllTickets(options = {}) {
    const defaultOptions = {
      select: `
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `
    };

    return await ticketsRepository.getAll({
      ...defaultOptions,
      ...options
    });
  }

  async getTicketById(ticketId) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    return await ticketsRepository.getById(ticketId, {
      select: `
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `
    });
  }

  async createTicket(ticketData) {
    if (!ticketData) {
      throw new Error("Ticket data is required");
    }

    const requiredFields = [
      "company_id",
      "ticket_title",
      "requester_department_id",
      "responsible_department_id",
      "sla_id",
      "priority_id",
      "status_id",
      "created_by_user_id"
    ];

    for (const field of requiredFields) {
      if (!ticketData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    return await ticketsRepository.create(ticketData);
  }

  async updateTicket(ticketId, ticketData) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    if (!ticketData) {
      throw new Error("Ticket data is required");
    }

    return await ticketsRepository.update(ticketId, ticketData);
  }

  async deleteTicket(ticketId) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    return await ticketsRepository.delete(ticketId);
  }
}

export default new TicketsService();