import usersController from "../controllers/users.controller.js";
import { Router } from "express";

const router = Router()

router.get('/',     usersController.getAll.bind(usersController))
router.get('/id/:id',     usersController.getById.bind(usersController))
router.get('/name/:name',     usersController.getByName.bind(usersController))
router.post('/',    usersController.create.bind(usersController))
router.put('/:id',     usersController.update.bind(usersController))
router.delete('/:id',      usersController.delete.bind(usersController))



export default router
