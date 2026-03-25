import prioritiesRepository from "../repositories/priorities.repository.js";

class PrioritiesService {

  async getAllPriorities(options = {}) {
    return await prioritiesRepository.getAll(options);
  }

  async getPriorityById(priorityId) {
    if (!priorityId) {
      throw new Error("Priority ID is required");
    }

    return await prioritiesRepository.getById(priorityId);
  }

  async createPriority(priorityData) {
    if (!priorityData) {
      throw new Error("Priority data is required");
    }

    if (!priorityData.priority_name) {
      throw new Error("Priority name is required");
    }

    if (priorityData.response_time_hours == null) {
      throw new Error("Response time (hours) is required");
    }

    return await prioritiesRepository.create(priorityData);
  }

  async updatePriority(priorityId, priorityData) {
    if (!priorityId) {
      throw new Error("Priority ID is required");
    }

    if (!priorityData) {
      throw new Error("Priority data is required");
    }

    return await prioritiesRepository.update(priorityId, priorityData);
  }

  async deletePriority(priorityId) {
    if (!priorityId) {
      throw new Error("Priority ID is required");
    }

    return await prioritiesRepository.delete(priorityId);
  }
}

export default new PrioritiesService();