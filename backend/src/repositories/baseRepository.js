import supabase from '../config/supabase.js';

class BaseRepository {
  constructor(tableName, idField = 'id') {
    // Nombre de la tabla en Supabase
    this.tableName = tableName;

    // Campo identificador primario
    this.idField = idField;
  }

  async getAll() {
    // Obtiene todos los registros de la tabla
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');

    if (error) {
      throw new Error(`Error al obtener registros de ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  async getById(id) {
    // Obtiene un registro por su identificador
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq(this.idField, id)
      .single();

    if (error) {
      throw new Error(`Error al obtener registro de ${this.tableName} por ID: ${error.message}`);
    }

    return data;
  }

  async create(payload) {
    // Inserta un nuevo registro
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
    // Actualiza un registro existente por su identificador
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
    // Elimina un registro por su identificador
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