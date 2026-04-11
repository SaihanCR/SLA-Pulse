import { chatWithAI } from "../services/ai/ai.service.js";
import { parseResponse } from "../utils/parseResponse.js";

class AIController {
  async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "El mensaje es requerido",
        });
      }

      const { intent, response } = await chatWithAI(message);

      //  SOLO parsear si es ticket
      if (intent === "ticket") {
        return res.json({
          type: "ticket",
          data: parseResponse(response),
        });
      }

      return res.json({
        type: "general",
        message: response,
      });

    } catch (error) {
      res.status(500).json({
        error: "Error procesando la solicitud",
      });
    }
  }
}

export default new AIController();