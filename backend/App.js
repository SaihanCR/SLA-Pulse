import express from 'express';
import './src/config/supabase.js';

import departmentsRoutes from "./src/routes/departments.routes.js";

const app = express();

app.use(express.json());

// 🔥 REGISTRAR RUTA
app.use("/api/departments", departmentsRoutes);

app.get('/', (req, res) => {
  res.send('API SLA Pulse funcionando...');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Base URL:`)
  console.log(`   http://localhost:${PORT}/`)
  console.log("   Punto base del backend SLA Pulse\n")

  console.log(`Endpoints disponibles:`)
  console.log(`   GET  http://localhost:${PORT}/api/departments`)
});
 