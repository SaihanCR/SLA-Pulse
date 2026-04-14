import alertsService from "../services/alerts.service.js";

class AlertsController {

  async runEngine(req, res) {
    try {
      const result = await alertsService.runEngine();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getActive(req, res) {
    try {
      const data = await alertsService.getActiveAlerts();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await alertsService.getAllAlerts();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AlertsController();