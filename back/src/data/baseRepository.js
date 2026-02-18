// Repositorio base reutilizable para cualquier tabla permitida.
// Implementa operaciones CRUD genéricas utilizando Supabase.
// Este patrón desacopla la capa de acceso a datos del resto de la aplicación.

import { supabaseAdmin } from "../config/supabaseClient.js";

export default class BaseRepository {
  constructor(tableName) {
    // Nombre de la tabla asociada
    this.table = tableName;

    // Cliente administrativo de Supabase
    this.supabase = supabaseAdmin;
  }

  // Obtiene múltiples registros con soporte para:
  // - filtros dinámicos
  // - paginación (limit, offset)
  // - ordenamiento
  async findAll({
    limit = 100,
    offset = 0,
    orderBy = null,
    ascending = true,
    filters = {},
  } = {}) {
    let query = this.supabase.from(this.table).select("*", { count: "exact" });

    // Aplicación dinámica de filtros tipo igualdad
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

    if (error) {
      throw error;
    }

    return {
      data,
      count,
      limit,
      offset,
    };
  }

  // Obtiene un registro por su ID
  async findById(id, idColumn = "id") {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq(idColumn, id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Inserta un nuevo registro
  async insert(payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

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

    if (error) {
      throw error;
    }

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

    if (error) {
      throw error;
    }

    return data;
  }
}
