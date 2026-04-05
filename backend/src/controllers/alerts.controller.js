import alertsService from "../services/alerts.service.js";

class AlertsController {

  async runEngine(req, res) {
    console.log("🚀 ENGINE EJECUTADO");
    try {
      const result = await alertsService.runEngine(); 
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AlertsController();