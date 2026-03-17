import express from 'express';
import './src/config/supabase.js';
import departmentRouter from './src/routes/departments.routes.js'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API SLA Pulse funcionando...');
});

app.use('/departments', departmentRouter)



const PORT = 3000;

app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
 console.log(`Base URL:`)
  console.log(`   http://localhost:${PORT}/`)
  console.log("   Punto base del backend SLA Pulse\n")
});


 