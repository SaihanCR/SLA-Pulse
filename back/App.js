import "dotenv/config"
import express from "express"
import { supabase } from "./src/config/supabase.js"
import { isAllowedTable, ALLOWED_TABLES } from "./src/db/allowedTables.js"

const app = express()
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "SLA Pulse API" })
})

app.get("/api/:table", async (req, res) => {
  const { table } = req.params

  if (!isAllowedTable(table)) {
    return res.status(400).json({
      error: { message: `Table ${table} is not allowed` }
    })
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .limit(200)

    if (error) return res.status(400).json({ error })

    return res.json(data)
  } catch (e) {
    return res.status(500).json({ error: { message: e.message } })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  // console.log("\n=======================================")
  // console.log(`API running on http://localhost:${PORT}/`)
  // console.log("=======================================\n")

  console.log(`Base URL:`)
  console.log(`   http://localhost:${PORT}/`)
  console.log("   = Punto base del backend SLA Pulse\n")

  console.log(`Health Check:`)
  console.log(`   http://localhost:${PORT}/health`)
  console.log("   = Verifica que la API esté funcionando\n")

  console.log(`Dynamic Table Endpoint:`)
  console.log(`   http://localhost:${PORT}/api/:table`)
  console.log("   = Consulta cualquier tabla permitida (whitelist)\n")

  console.log("Allowed Tables:")
  ALLOWED_TABLES.forEach((t) => {
    console.log(`   http://localhost:${PORT}/api/${t}`)
  })

  console.log("=======================================\n")
})
