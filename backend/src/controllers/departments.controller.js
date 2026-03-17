/*
Controller de Departments

Responsabilidades:
- Manejar la request (req)
- Llamar al service
- Devolver la response (res)
- Manejar errores HTTP

NO contiene lógica de negocio
*/

import departmentsService from "../services/departments.service.js";

/*
  GET /api/departments
  Obtiene todos los departamentos
*/
export async function getDepartments(req, res) {
  try {
    const data = await departmentsService.getAllDepartments();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

/*
  GET /api/departments/:id
  Obtiene un departamento por ID
*/
export async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;

    const data = await departmentsService.getDepartmentById(id);

    return res.json(data);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}

/*
  POST /api/departments
  Crea un nuevo departamento
*/
export async function createDepartment(req, res) {
  try {
    const data = await departmentsService.createDepartment(req.body);

    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}

/*
  PUT /api/departments/:id
  Actualiza un departamento
*/
export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;

    const data = await departmentsService.updateDepartment(id, req.body);

    return res.json(data);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}

/*
  DELETE /api/departments/:id
  Elimina un departamento
*/
export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;

    await departmentsService.deleteDepartment(id);

    return res.json({
      message: "Department deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}