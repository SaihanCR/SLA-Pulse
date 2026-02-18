import "dotenv/config"
import express from "express"
import { supabase } from "./src/config/supabase.js"

const app = express()
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "SLA Pulse API" })
})

/*
  🔒 Lista blanca de tablas permitidas
*/
/*
const ALLOWED_TABLES = [
    //stg
    "ingest_requests",
    "ticket_events_raw",
    //rules  
    "services",
    "sla_policies",
    "alert_rules",
    //golden
    "ticket_current_state",
    "sla_summary_by_service",
    "alerts",
    //hist
    "tickets",
    "ticket_events",
    "sla_evaluations",
]
    */

const TABLE_GROUPS = {
  stg: ["ingest_requests", "ticket_events_raw"],

  rules: ["services", "sla_policies", "alert_rules"],

  golden: ["ticket_current_state", "sla_summary_by_service", "alerts"],

  hist: ["tickets", "ticket_events", "sla_evaluations"]
}

// Lista final permitida (sin repetir)
const ALLOWED_TABLES = Object.values(TABLE_GROUPS).flat()


/*
  Endpoint dinámico:
  GET /api/:table
*/
app.get("/api/:table", async (req, res) => {
  const { table } = req.params

  if (!ALLOWED_TABLES.includes(table)) {
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
  console.log(`API running on http://localhost:${PORT}`)
})
