import slasRepository from "../repositories/slas.repository.js";

class SlasService {

  async getAllSlas(options = {}) {
    return await slasRepository.getAll(options);
  }

  async getSlaById(slaId) {
    if (!slaId) {
      throw new Error("SLA ID is required");
    }

    return await slasRepository.getById(slaId);
  }

  async createSla(slaData) {
    if (!slaData) {
      throw new Error("SLA data is required");
    }

    if (!slaData.sla_title) {
      throw new Error("SLA title is required");
    }

    if (!slaData.priority_id) {
      throw new Error("Priority ID is required");
    }

    if (!slaData.department_id) {
      throw new Error("Department ID is required");
    }

    if (!slaData.sla_hours) {
      throw new Error("SLA hours is required");
    }

    return await slasRepository.create(slaData);
  }

  async updateSla(slaId, slaData) {
    if (!slaId) {
      throw new Error("SLA ID is required");
    }

    if (!slaData) {
      throw new Error("SLA data is required");
    }

    return await slasRepository.update(slaId, slaData);
  }

  async deleteSla(slaId) {
    if (!slaId) {
      throw new Error("SLA ID is required");
    }

    return await slasRepository.delete(slaId);
  }

  async getSlasByDepartment(departmentId) {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    return await slasRepository.findByDepartment(departmentId);
  }
}

export default new SlasService();