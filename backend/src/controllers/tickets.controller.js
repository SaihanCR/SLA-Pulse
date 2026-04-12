import ticketsService from '../services/tickets.service.js';

class TicketsController {
  async getAll(req, res) {
    try {
      const data = await ticketsService.getAllTickets();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await ticketsService.getTicketById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getDetail(req, res) {
    try {
      const data = await ticketsService.getTicketDetail(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await ticketsService.createTicket(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await ticketsService.updateTicket(req.params.id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await ticketsService.deleteTicket(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getByCompany(req, res) {
    try {
      const { company_id } = req.query;
      const data = await ticketsService.getTicketsByCompany(company_id);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByStatus(req, res) {
    try {
      const { status_id } = req.query;
      const data = await ticketsService.getTicketsByStatus(status_id);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByPriority(req, res) {
    try {
      const { priority_id } = req.query;
      const data = await ticketsService.getTicketsByPriority(priority_id);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByResponsibleDepartment(req, res) {
    try {
      const { responsible_department_id } = req.query;
      const data = await ticketsService.getTicketsByResponsibleDepartment(
        responsible_department_id
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByRequesterDepartment(req, res) {
    try {
      const { requester_department_id } = req.query;
      const data = await ticketsService.getTicketsByRequesterDepartment(
        requester_department_id
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async search(req, res) {
    try {
      const { term } = req.query;
      const data = await ticketsService.searchTickets(term);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TicketsController();