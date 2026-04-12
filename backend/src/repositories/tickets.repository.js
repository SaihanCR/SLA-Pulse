import BaseRepository from './baseRepository.js';
import supabase from '../config/supabase.js';

class TicketsRepository extends BaseRepository {
  constructor() {
    super('tickets', 'ticket_id');
  }

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets por compañía: ${error.message}`);
    }

    return data;
  }

  async findByStatus(statusId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets por estatus: ${error.message}`);
    }

    return data;
  }

  async findByPriority(priorityId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('priority_id', priorityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets por prioridad: ${error.message}`);
    }

    return data;
  }

  async findByResponsibleDepartment(departmentId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('responsible_department_id', departmentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets por departamento responsable: ${error.message}`);
    }

    return data;
  }

  async findByRequesterDepartment(departmentId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('requester_department_id', departmentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets por departamento solicitante: ${error.message}`);
    }

    return data;
  }

  async searchByCodeOrTitle(term) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .or(`ticket_code.ilike.%${term}%,ticket_title.ilike.%${term}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar tickets: ${error.message}`);
    }

    return data;
  }

  async getDetailById(ticketId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        companies(company_name),
        priorities(priority_name),
        ticket_statuses(status_name)
      `)
      .eq('ticket_id', ticketId)
      .single();

    if (error) {
      throw new Error(`Error al obtener detalle del ticket: ${error.message}`);
    }

    return data;
  }
}

export default new TicketsRepository();