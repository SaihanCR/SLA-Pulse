import usersService from "../services/users.service.js";


class userController {
    async getAll(req, res) {
        try {
            const data = await usersService.getUsers()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await usersService.getUserByid(req.params.id)
            res.status(200).json(data)
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const data = await usersService.createUser(req.body)
            res.status(201).json(data)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const data = await usersService.updateUser(req.params.id, req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const data = await usersService.deleteUser(req.params.id)
            res.status(204).json(data)
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new userController()