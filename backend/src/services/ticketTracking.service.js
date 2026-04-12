import ticketTrackingRepository from "../repositories/ticketTracking.repository.js";

class TicketTrackingService {
  async getAllTrackings() {
    return await ticketTrackingRepository.getAll();
  }

  async getTrackingById(trackingId) {
    if (!trackingId) {
      throw new Error("Tracking ID is required");
    }

    return await ticketTrackingRepository.getById(trackingId);
  }

  validateDates(startedAt, finishedAt) {
    if (startedAt && finishedAt) {
      const startDate = new Date(startedAt);
      const finishDate = new Date(finishedAt);

      if (Number.isNaN(startDate.getTime())) {
        throw new Error("started_at is not a valid date");
      }

      if (Number.isNaN(finishDate.getTime())) {
        throw new Error("finished_at is not a valid date");
      }

      if (finishDate < startDate) {
        throw new Error("finished_at cannot be earlier than started_at");
      }
    }
  }

  async createTracking(trackingData) {
    if (!trackingData) {
      throw new Error("Tracking data is required");
    }

    if (!trackingData.ticket_id) {
      throw new Error("ticket_id is required");
    }

    if (!trackingData.status_id) {
      throw new Error("status_id is required");
    }

    this.validateDates(trackingData.started_at, trackingData.finished_at);

    return await ticketTrackingRepository.create(trackingData);
  }

  async updateTracking(trackingId, trackingData) {
    if (!trackingId) {
      throw new Error("Tracking ID is required");
    }

    if (!trackingData) {
      throw new Error("Tracking data is required");
    }

    this.validateDates(trackingData.started_at, trackingData.finished_at);

    return await ticketTrackingRepository.update(trackingId, trackingData);
  }

  async deleteTracking(trackingId) {
    if (!trackingId) {
      throw new Error("Tracking ID is required");
    }

    return await ticketTrackingRepository.delete(trackingId);
  }

  async getTrackingsByTicket(ticketId, includeDetails = true) {
    if (!ticketId) {
      throw new Error("ticket_id is required");
    }

    if (includeDetails) {
      return await ticketTrackingRepository.findByTicketDetailed(ticketId);
    }

    return await ticketTrackingRepository.findByTicket(ticketId);
  }
}

export default new TicketTrackingService();