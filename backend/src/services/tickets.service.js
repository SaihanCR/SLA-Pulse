import ticketsRepository from "../repositories/tickets.repository.js";
import slasRepository from "../repositories/slas.repository.js";
import ticketTrackingRepository from "../repositories/ticketTracking.repository.js";

class TicketsService {
  generateTicketCode(companyId) {
    const companyPrefix = companyId
      ? companyId.replace(/-/g, "").substring(0, 4).toUpperCase()
      : "TCKT";

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    return `${companyPrefix}-${year}${month}${day}-${randomNumber}`;
  }

  sanitizeTicketData(ticketData = {}) {
    return {
      ...ticketData,
      ticket_title: ticketData.ticket_title?.trim() || "",
      ticket_description: ticketData.ticket_description?.trim() || null,
    };
  }

  validateRequiredFields(ticketData) {
    const requiredFields = [
      "company_id",
      "ticket_title",
      "requester_department_id",
      "responsible_department_id",
      "sla_id",
      "priority_id",
      "status_id",
      "created_by_user_id",
    ];

    for (const field of requiredFields) {
      if (!ticketData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    if (!ticketData.ticket_title?.trim()) {
      throw new Error("ticket_title is required");
    }
  }

  async validateSlaConsistency(ticketData) {
    const sla = await slasRepository.getById(ticketData.sla_id);

    if (!sla) {
      throw new Error("SLA not found");
    }

    if (sla.priority_id !== ticketData.priority_id) {
      throw new Error("The selected SLA does not belong to the selected priority");
    }

    if (sla.department_id !== ticketData.responsible_department_id) {
      throw new Error("The selected SLA does not belong to the responsible department");
    }
  }

  buildTrackingPayload(ticket) {
    return {
      ticket_id: ticket.ticket_id,
      status_id: ticket.status_id,
      assigned_user_id: ticket.assigned_user_id || null,
      started_at: ticket.started_at || null,
      finished_at: ticket.finished_at || null,
      reason: ticket.reason || null,
    };
  }

  async createTrackingIfNeeded(previousTicket, updatedTicket) {
    const statusChanged = previousTicket.status_id !== updatedTicket.status_id;
    const assignedUserChanged =
      (previousTicket.assigned_user_id || null) !==
      (updatedTicket.assigned_user_id || null);

    const startedAtChanged =
      (previousTicket.started_at || null) !== (updatedTicket.started_at || null);

    const finishedAtChanged =
      (previousTicket.finished_at || null) !==
      (updatedTicket.finished_at || null);

    const reasonChanged =
      (previousTicket.reason || null) !== (updatedTicket.reason || null);

    if (
      statusChanged ||
      assignedUserChanged ||
      startedAtChanged ||
      finishedAtChanged ||
      reasonChanged
    ) {
      await ticketTrackingRepository.create(
        this.buildTrackingPayload(updatedTicket)
      );
    }
  }

  async getAllTickets(options = {}) {
    const defaultOptions = {
      select: `
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `,
      orderBy: "created_at",
      ascending: false,
    };

    return await ticketsRepository.getAll({
      ...defaultOptions,
      ...options,
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
      `,
    });
  }

  async getTicketDetail(ticketId) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    const ticket = await ticketsRepository.getDetailById(ticketId);
    const tracking = await ticketTrackingRepository.findByTicketDetailed(ticketId);

    return {
      ticket,
      tracking,
    };
  }

  async createTicket(ticketData) {
    if (!ticketData) {
      throw new Error("Ticket data is required");
    }

    const sanitizedData = this.sanitizeTicketData(ticketData);

    this.validateRequiredFields(sanitizedData);
    await this.validateSlaConsistency(sanitizedData);

    const payload = {
      ...sanitizedData,
      ticket_code:
        sanitizedData.ticket_code ||
        this.generateTicketCode(sanitizedData.company_id),
    };

    const createdTicket = await ticketsRepository.create(payload);

    await ticketTrackingRepository.create(this.buildTrackingPayload(createdTicket));

    return createdTicket;
  }

  async updateTicket(ticketId, ticketData) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    if (!ticketData) {
      throw new Error("Ticket data is required");
    }

    const currentTicket = await ticketsRepository.getById(ticketId);

    if (!currentTicket) {
      throw new Error("Ticket not found");
    }

    const sanitizedData = this.sanitizeTicketData(ticketData);

    const forbiddenFields = [
      "ticket_id",
      "ticket_code",
      "created_at",
      "created_by_user_id",
      "company_id",
    ];

    for (const field of forbiddenFields) {
      if (field in sanitizedData) {
        delete sanitizedData[field];
      }
    }

    const mergedTicket = {
      ...currentTicket,
      ...sanitizedData,
    };

    if (
      sanitizedData.ticket_title !== undefined &&
      !mergedTicket.ticket_title?.trim()
    ) {
      throw new Error("ticket_title cannot be empty");
    }

    if (
      sanitizedData.sla_id ||
      sanitizedData.priority_id ||
      sanitizedData.responsible_department_id
    ) {
      await this.validateSlaConsistency(mergedTicket);
    }

    const updatedTicket = await ticketsRepository.update(ticketId, sanitizedData);

    await this.createTrackingIfNeeded(currentTicket, updatedTicket);

    return updatedTicket;
  }

  async deleteTicket(ticketId) {
    if (!ticketId) {
      throw new Error("Ticket ID is required");
    }

    return await ticketsRepository.delete(ticketId);
  }

  async getTicketsByCompany(companyId) {
    if (!companyId) {
      throw new Error("company_id is required");
    }

    return await ticketsRepository.findByCompany(companyId);
  }

  async getTicketsByStatus(statusId) {
    if (!statusId) {
      throw new Error("status_id is required");
    }

    return await ticketsRepository.findByStatus(statusId);
  }

  async getTicketsByPriority(priorityId) {
    if (!priorityId) {
      throw new Error("priority_id is required");
    }

    return await ticketsRepository.findByPriority(priorityId);
  }

  async getTicketsByResponsibleDepartment(departmentId) {
    if (!departmentId) {
      throw new Error("responsible_department_id is required");
    }

    return await ticketsRepository.findByResponsibleDepartment(departmentId);
  }

  async getTicketsByRequesterDepartment(departmentId) {
    if (!departmentId) {
      throw new Error("requester_department_id is required");
    }

    return await ticketsRepository.findByRequesterDepartment(departmentId);
  }

  async searchTickets(term) {
    if (!term?.trim()) {
      throw new Error("search term is required");
    }

    return await ticketsRepository.searchByCodeOrTitle(term.trim());
  }
}

export default new TicketsService();