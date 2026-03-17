import departmentsRepository from "../repositories/departments.repository.js";

class DepartmentsService {

  async getAllDepartments(options = {}) {
    return await departmentsRepository.getAll(options);
  }

  async getDepartmentById(departmentId) {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    return await departmentsRepository.getById(departmentId);
  }

  async createDepartment(departmentData) {
    if (!departmentData) {
      throw new Error("Department data is required");
    }

    if (!departmentData.name) {
      throw new Error("Department name is required");
    }

    return await departmentsRepository.create(departmentData);
  }

  async updateDepartment(departmentId, departmentData) {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    if (!departmentData) {
      throw new Error("Department data is required");
    }

    return await departmentsRepository.update(departmentId, departmentData);
  }

  async deleteDepartment(departmentId) {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    return await departmentsRepository.delete(departmentId);
  }
}

export default new DepartmentsService();