// Repositorio base reutilizable para cualquier tabla.
// Implementa operaciones CRUD genéricas con Supabase.
// Sirve como base para repositorios específicos (tickets, services, roles, etc.).

import { supabase } from "../config/supabase.js";

export default class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.supabase = supabase;
  }

  // Obtiene múltiples registros con soporte para:
  // - filtros dinámicos (eq)
  // - paginación (limit, offset)
  // - ordenamiento (orderBy, ascending)
  // - count total (para paginación real en frontend)
  async findAll({
    limit = 50,
    offset = 0,
    orderBy = null,
    ascending = true,
    filters = {},
    select = "*",
  } = {}) {
    let query = this.supabase
      .from(this.table)
      .select(select, { count: "exact" });

    // Aplicación de filtros simples tipo igualdad
    for (const [field, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(field, value);
      }
    }

    // Ordenamiento opcional
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Paginación usando range
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count, limit, offset };
  }

  // Obtiene un registro por ID (PK configurable)
  async findById(id, idColumn = "id", select = "*") {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(select)
      .eq(idColumn, id)
      .single();

    if (error) throw error;

    return data;
  }

  // Inserta un registro
  async insert(payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Actualiza un registro por ID
  async update(id, payload, idColumn = "id") {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(payload)
      .eq(idColumn, id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Elimina un registro por ID
  async remove(id, idColumn = "id") {
    const { data, error } = await this.supabase
      .from(this.table)
      .delete()
      .eq(idColumn, id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
