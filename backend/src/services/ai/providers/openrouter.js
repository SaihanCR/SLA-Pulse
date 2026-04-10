import axios from "axios";
import { cleanResponse } from "../../../utils/cleanResponse.js";

export const openRouterProvider = async (message, prompt) => {
  try {
    console.log(" OpenRouter llamado");

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(" OpenRouter respondió correctamente");

    const rawResponse = res.data?.choices?.[0]?.message?.content || "";

    return cleanResponse(rawResponse);

  } catch (error) {
    console.error(" Error en OpenRouter:");
    console.error(error.response?.data || error.message);
    throw error;
  }
};