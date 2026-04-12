import ticketTrackingService from "../services/ticketTracking.service.js";

class TicketTrackingController {
  async getAll(req, res) {
    try {
      const data = await ticketTrackingService.getAllTrackings();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await ticketTrackingService.getTrackingById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await ticketTrackingService.createTracking(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await ticketTrackingService.updateTracking(
        req.params.id,
        req.body
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await ticketTrackingService.deleteTracking(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getByTicket(req, res) {
    try {
      const { ticket_id, include_details } = req.query;

      const includeDetails =
        include_details === undefined ? true : include_details === "true";

      const data = await ticketTrackingService.getTrackingsByTicket(
        ticket_id,
        includeDetails
      );

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TicketTrackingController();