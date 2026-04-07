import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';

class AlertsRepository extends BaseRepository {
  constructor() {
    super('alerts', 'alert_id');
  }

  async findActiveByTicket(ticketId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('ticket_id', ticketId)
      .eq('status', 'OPEN')
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
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

}



export default new AlertsRepository();