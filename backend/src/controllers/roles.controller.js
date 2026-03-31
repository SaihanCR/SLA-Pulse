import rolesService from '../services/roles.service.js';

class RolesController {
    async getAll(req, res) {
        try {
            const data = await rolesService.getallRoles();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await rolesService.getRolesById(req.params.id);
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const data = await rolesService.createRole(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const data = await rolesService.updateRole(req.params.id, req.body);
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await rolesService.deleteRole(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new RolesController();