import ticketStatusesRepository from "../repositories/ticketStatuses.repository.js";

class TicketStatusesService {

  async getAllStatuses(options = {}) {
    return await ticketStatusesRepository.getAll(options);
  }

  async getStatusById(statusId) {
    if (!statusId) {
      throw new Error("Status ID is required");
    }

    return await ticketStatusesRepository.getById(statusId);
  }

  async createStatus(statusData) {
    if (!statusData) {
      throw new Error("Status data is required");
    }

    if (!statusData.status_name) {
      throw new Error("Status name is required");
    }

    return await ticketStatusesRepository.create(statusData);
  }

  async updateStatus(statusId, statusData) {
    if (!statusId) {
      throw new Error("Status ID is required");
    }

    if (!statusData) {
      throw new Error("Status data is required");
    }

    return await ticketStatusesRepository.update(statusId, statusData);
  }

  async deleteStatus(statusId) {
    if (!statusId) {
      throw new Error("Status ID is required");
    }

    return await ticketStatusesRepository.delete(statusId);
  }
}

export default new TicketStatusesService();