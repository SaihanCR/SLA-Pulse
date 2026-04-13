import supabase from '../config/supabase.js';

class BaseRepository {
  constructor(tableName, idField = 'id') {
    this.tableName = tableName;
    this.idField = idField;
  }

  async getAll(options = {}) {
    const {
      select = '*',
      orderBy = null,
      ascending = true,
    } = options;

    let query = supabase
      .from(this.tableName)
      .select(select);

    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener registros de ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  async getById(id, options = {}) {
    const {
      select = '*',
    } = options;

    let query = supabase
      .from(this.tableName)
      .select(select)
      .eq(this.idField, id)
      .single();

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener registro de ${this.tableName} por ID: ${error.message}`);
    }

    return data;
  }

  async create(payload) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear registro en ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  async update(id, payload) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(payload)
      .eq(this.idField, id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar registro en ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq(this.idField, id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al eliminar registro de ${this.tableName}: ${error.message}`);
    }

    return data;
  }
}

export default BaseRepository;