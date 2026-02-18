// Archivo de arranque del servidor.
// Inicia Express y deja la app escuchando en el puerto configurado.

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
