import userRepository from '../repositories/users.repository.js';
import authService from './auth.service.js';

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

        const { company_id, role_id, department_id, first_name, last_name, job_title, is_active, user_email, user_psw } = userData

        // creamos el usuario en supabase auth

        const data = await authService.signUp({user_email, user_psw})

        // creamos el usuario en la tabla users con el id del auth user
        const payload = {
            user_id: data.user.id,
            company_id,
            role_id,
            department_id,
            first_name: first_name.toUpperCase(), //normalizamos el nombre a mayusculas
            last_name,
            job_title,
            int_cod_user: await this.genreateUserCode(first_name), // generamos un codigo unico para el usuario
            is_active
        }


        return await userRepository.create(payload)
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

    //Genera un código único para el usuario basado en su nombre
    async genreateUserCode(userName) {
        // Generamos un codigo unico para el usuario
        const prefix = userName.slice(0, 3).toUpperCase(); // Tomamos las primeras 3 letras del nombre y las convertimos a mayusculas
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Genera un número aleatorio de 4 dígitos
        const userCode = `${prefix}-${randomNumber}`;


        // Verificamos que el código no exista en la base de datos
        const exists = await userRepository.codeExists(userCode);
        if (exists) {            // Si el código ya existe, generamos uno nuevo
            return this.genreateUserCode();
        }


        return userCode;
    }

}

export default new UserService()