import departmentsRepository from "../repositories/departments.repository.js";

class DepartmentsService {

  //logica de department_code
  generateDepartmentCode(departmentName) {
    // Genera el código del departamento basado en el nombre

    const words = departmentName.trim().toUpperCase().split(" ");

    let prefix = "";

    if (words.length >= 2) {
      // Primera letra de las dos primeras palabras
      prefix = words[0][0] + words[1][0];
    } else {
      const word = words[0];

      if (word.length >= 2) {
        prefix = word.substring(0, 2);
      } else {
        prefix = word[0];
      }
    }

    // Genera número random de 6 dígitos
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return `${prefix}${randomNumber}`;
  }

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

    if (!departmentData.department_name) {
      throw new Error("Department name is required");
    }

    // Normaliza a MAYÚSCULA
    departmentData.department_name = departmentData.department_name.toUpperCase();

    // Genera automáticamente el department_code
    departmentData.department_code = this.generateDepartmentCode(departmentData.department_name);

    return await departmentsRepository.create(departmentData);
  }

  async updateDepartment(departmentId, departmentData) {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    if (!departmentData) {
      throw new Error("Department data is required");
    }

    // Si viene el nombre, lo normaliza
    if (departmentData.department_name) {
      departmentData.department_name = departmentData.department_name.toUpperCase();
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