import BaseRepository from "./baseRepository.js";
import supabase from "../config/supabase.js";

class TicketTrackingRepository extends BaseRepository {
  constructor() {
    super("ticket_tracking", "tracking_id");
  }

  removeDuplicates(items = []) {
    const seen = new Set();

    return items.filter((item) => {
      const key = `${item.tracking_id}-${item.created_at || ""}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  async findByTicket(ticketId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error al buscar historial del ticket: ${error.message}`);
    }

    return this.removeDuplicates(data || []);
  }

  async findByTicketDetailed(ticketId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        tracking_id,
        ticket_id,
        status_id,
        assigned_user_id,
        started_at,
        finished_at,
        reason,
        created_at,
        statuses (
          status_id,
          status_name
        ),
        users (
          user_id,
          full_name,
          user_name,
          email
        )
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      return await this.findByTicket(ticketId);
    }

    return this.removeDuplicates(data || []);
  }
}

export default new TicketTrackingRepository();