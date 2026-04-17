import ticketOptionsService from "../services/ticketOptions.service.js";

const getOptions = async (req, res) => {
  try {
    const data = await ticketOptionsService.getTicketOptions();

    console.log("TICKET OPTIONS:", data); // 👈 debug útil

    res.json(data);
  } catch (error) {
    console.error("ERROR OPTIONS:", error.message);

    res.status(500).json({
      message: "Error obteniendo opciones",
    });
  }
};

export default {
  getOptions,
};