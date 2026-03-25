import userRepository from '../repositories/users.repository.js';

class UserService {

    async getUsers() {
        return await userRepository.getAll()
    }

    async getUsers() {
        return await userRepository.getAll()
    }
    async getUserByid(userid) {

        return await userRepository.getById(userid)
    }
    async createUser(userData) {
        if (!userData) {
            throw new Error('User data is requiered')
        }

        // normaliza nombre a mayusculas

        userData.first_name = userData.first_name.toUpperCase()

        return await userRepository.create(userData)
    }
    async updateUser(userid, userData) {
        if (!userData) {
            throw new Error('User Data required')
        }

        if (!userid) {
            throw new Error('User ID required')
        }

        if (userData.first_name) {
            userData.first_name = userData.first_name.toUpperCase()
        }

        return await userRepository.update(userid, userData)
    }

    async deleteUser(userId) {
        if (!userId) {
            throw new Error('User ID required')
        }

        return await userRepository.delete(userId);
    }

}

export default new UserService()