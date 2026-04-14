import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';

class AlertsRepository extends BaseRepository {
  constructor() {
    super('alerts', 'alert_id');
  }

  async findActiveByTicketAndSeverity(ticket_id, severity) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("ticket_id", ticket_id)
      .eq("severity", severity)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      throw new Error(`Error buscando alerta existente: ${error.message}`);
    }

    return data;
  }

  async resolveByTicketAndSeverity(ticket_id, severity) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString()
      })
      .eq("ticket_id", ticket_id)
      .eq("severity", severity)
      .eq("status", "active")
      .select();

    if (error) {
      throw new Error(`Error resolviendo alerta: ${error.message}`);
    }

    return data;
  }

  async getActiveAlerts() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        tickets (
          ticket_id,
          ticket_code,
          ticket_title
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error obteniendo alertas activas: ${error.message}`);
    }

    return data;
  }

  async getAllAlerts() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        tickets (
          ticket_id,
          ticket_code,
          ticket_title
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error obteniendo historial de alertas: ${error.message}`);
    }

    return data;
  }
  
}

export default new AlertsRepository();