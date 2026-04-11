import supabase from '../config/supabase.js';

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

        console.log('access token:', data.session.access_token)
        console.log('user id:', data.user.id)
        console.log('user email:', data.user.email)
        console.log('last log in:', data.user.last_sign_in_at)

        return data
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