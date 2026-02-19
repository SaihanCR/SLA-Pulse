// Repositorio base reutilizable para cualquier tabla.
// Implementa operaciones CRUD genéricas utilizando Supabase.
// Esta clase es la base de todos los repositorios del sistema.

import { supabase } from "../config/supabase.js";

export default class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.supabase = supabase;
  }

  // ==============================
  // LIST (con filtros y paginación)
  // ==============================
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

    // Filtros simples tipo igualdad
    for (const [field, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(field, value);
      }
    }

    // Ordenamiento
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data,
      count,
      limit,
      offset,
    };
  }

  // ==============================
  // GET BY ID
  // ==============================
  async findById(id, idColumn = "id", select = "*") {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(select)
      .eq(idColumn, id)
      .single();

    if (error) throw error;

    return data;
  }

  // ==============================
  // CREATE
  // ==============================
  async insert(payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // ==============================
  // UPDATE
  // ==============================
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

  // ==============================
  // DELETE
  // ==============================
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
