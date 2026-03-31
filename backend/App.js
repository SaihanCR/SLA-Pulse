import express from 'express';
import './src/config/supabase.js';

import departmentsRoutes from "./src/routes/departments.routes.js";
import companiesRoutes from "./src/routes/companies.routes.js"
import slasRoutes from "./src/routes/slas.routes.js"
import prioritiesRoutes from "./src/routes/priorities.routes.js"
import rolesRoutes from "./src/routes/roles.routes.js"
import userRoutes from "./src/routes/users.routes.js"
import ticketsRoutes from "./src/routes/tickets.routes.js";
import authRoutes from "./src/routes/auth.routes.js"

const app = express();

app.use(express.json());

//REGISTRAR RUTAS
app.use("/api/departments", departmentsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/slas", slasRoutes);
app.use("/api/priorities", prioritiesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
  res.send('API en funcionamiento... Se a conectado correctamente con Supabase');
});





const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Base URL:`)
  console.log(`   http://localhost:${PORT}/`)
  console.log("   Punto base del backend SLA Pulse\n")

  console.log(`Endpoints disponibles:`)
  console.log(`   Companies  http://localhost:${PORT}/api/companies`)
  console.log(`   Departments  http://localhost:${PORT}/api/departments`)
  console.log(`   SLAs  http://localhost:${PORT}/api/slas`)
  console.log(`   Priorities  http://localhost:${PORT}/api/priorities`)
  console.log(`   Roles  http://localhost:${PORT}/api/roles`)
  console.log(`   Usuarios  http://localhost:${PORT}/api/users`)
  console.log(`   Tickets  http://localhost:${PORT}/api/tickets`)
  console.log(`   Auth  http://localhost:${PORT}/api/auth`)
});