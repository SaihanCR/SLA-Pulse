/* 
Sayjan, Francis les deje la estrucura base. ya ustedes le agregan la logica de negocio

A estructura me refiero que estos llama al repositorio con diferente llamadas

para mas info.. haz una rama del chat: Arquitectura Backend SLA Pulse
*/

import departmentsRepository from '../repositories/departments.repository.js';

class DepartmentsService {
  async getAllDepartments() {
    // Obtiene todos los departamentos
    return await departmentsRepository.getAll();
  }

  async getDepartmentById(departmentId) {
    // Obtiene un departamento por su ID
    return await departmentsRepository.getById(departmentId);
  }

  async createDepartment(departmentData) {
    // Crea un nuevo departamento
    return await departmentsRepository.create(departmentData);
  }

  async updateDepartment(departmentId, departmentData) {
    // Actualiza un departamento existente
    return await departmentsRepository.update(departmentId, departmentData);
  }

  async deleteDepartment(departmentId) {
    // Elimina un departamento por su ID
    return await departmentsRepository.delete(departmentId);
  }
}

export default new DepartmentsService();