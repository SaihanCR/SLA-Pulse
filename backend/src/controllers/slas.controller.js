import slasService from '../services/slas.service.js';

class SlasController {

  async getAll(req, res) {
    try {
      const data = await slasService.getAllSlas();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await slasService.getSlaById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await slasService.createSla(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await slasService.updateSla(req.params.id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await slasService.deleteSla(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }


  async getByDepartment(req, res) {
    try {
      const { department_id } = req.query;

      const data = await slasService.getSlasByDepartment(department_id);

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new SlasController();