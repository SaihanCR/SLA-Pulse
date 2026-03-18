// controllers/companies.controller.js
import companiesService from '../services/companies.service.js';

class CompaniesController {

  async getAll(req, res) {
    try {
      const data = await companiesService.getAllCompanies();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await companiesService.getCompanyById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await companiesService.createCompany(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await companiesService.updateCompany(req.params.id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await companiesService.deleteCompany(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

}

export default new CompaniesController();