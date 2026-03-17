// controllers/departments.controller.js
import departmentsService from '../services/departments.service.js';

class DepartmentsController {
  async getAll(req, res) {
    try {
      const data = await departmentsService.getAllDepartments();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await departmentsService.getDepartmentById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await departmentsService.createDepartment(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await departmentsService.updateDepartment(req.params.id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await departmentsService.deleteDepartment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default new DepartmentsController();