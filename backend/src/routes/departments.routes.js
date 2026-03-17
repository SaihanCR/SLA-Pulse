/*
Routes de Departments

Responsabilidades:
- Definir endpoints HTTP
- Mapear rutas → controllers

NO contiene lógica de negocio
*/

import express from "express";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/departments.controller.js";

const router = express.Router();

/*
  GET /api/departments
  Lista todos los departamentos
*/
router.get("/", getDepartments);

/*
  GET /api/departments/:id
  Obtiene un departamento por ID
*/
router.get("/:id", getDepartmentById);

/*
  POST /api/departments
  Crea un nuevo departamento
*/
router.post("/", createDepartment);

/*
  PUT /api/departments/:id
  Actualiza un departamento
*/
router.put("/:id", updateDepartment);

/*
  DELETE /api/departments/:id
  Elimina un departamento
*/
router.delete("/:id", deleteDepartment);

export default router;