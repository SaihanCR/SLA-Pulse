import supabase from '../config/supabase.js';
import usersRepository from '../repositories/users.repository.js';
import roleRepository from '../repositories/roles.repository.js';

class authService {

    async signUp(signUpData) {
        if (!signUpData) {
            throw new Error('Sign up data required')
        }
        const { user_email, user_psw } = signUpData

        const { data, error } = await supabase.auth.signUp({
            email: user_email,
            password: user_psw
        })

        if (error) {
            throw new Error('Error signing up: ' + error.message)
        }

        return data
    }



    async logIn(loginData) {
        if (!loginData) {
            throw new Error('Login data required')
        }

        const { user_email, user_psw } = loginData

        const { data, error } = await supabase.auth.signInWithPassword({
            email: user_email,
            password: user_psw
        })

        if (error) {
            throw new Error('Error logging in: ' + error.message)
        }

        const userData = await usersRepository.getById(data.user.id, { select: 'role_id, company_id, department_id' });

        const userRole = await roleRepository.getById(userData.role_id, { select: 'role_name' });

        if (!userData) {
            throw new Error('Error fetching user data: User not found')
        }

        if (!userRole) {
            throw new Error('Error fetching user role: Role not found')
        }

        return {
            session: data.session,
            user: {
                id: data.user.id,
                email: data.user.email,
                role: userRole.role_name,
                company_id: userData.company_id,
                department_id: userData.department_id
            }
        }
    }


    async logOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw new Error('Error logging out: ' + error.message)
    }

    return { message: 'Logged out successfully' }
}

    async updateUser(userid, updateData) {
    if (!userid) {
        throw new Error('User ID required')
    }
    if (!updateData) {
        throw new Error('Update data required')
    }
    const { error } = await supabase.auth.admin.updateUserById(userid, updateData)
    if (error) {
        throw new Error('Error updating user: ' + error.message)
    }
}

    async deleteUser(userid) {
    if (!userid) {
        throw new Error('User ID required')
    }
    const { error } = await supabase.auth.admin.deleteUser(userid)
    if (error) {
        throw new Error('Error deleting user: ' + error.message)
    }
}

}

export default new authService()