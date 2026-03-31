import rolesRepository from '../repositories/roles.repository.js';

class rolesService {
    async getallRoles(options = {}) {
        return await rolesRepository.getAll(options)
    }

    async getRolesById(roleId) {
        return await rolesRepository.getById(roleId);
    }

    async createRole(roleData) {
        if (!roleData) {
            throw new Error('Role data is required');
        }

        // si viene el nombre lo normaliza a mayúscula
        roleData.role_name = roleData.role_name.toUpperCase();

        return await rolesRepository.create(roleData);
    }
    async updateRole(roleId, roleData) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }

        if (!roleData) {
            throw new Error('Role data is required');
        }

        // si viene el nombre lo normaliza a mayúscula
        if (roleData.role_name) {
            roleData.role_name = roleData.role_name.toUpperCase();
        }

        return await rolesRepository.update(roleId, roleData);

    }

    async deleteRole(roleId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }   

        return await rolesRepository.delete(roleId);
    }
}

export default new rolesService();