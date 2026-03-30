import authService from '../services/auth.service.js'
class authController {
     async logIn(req, res) {
        try {
            const data = await authService.logIn(req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async logOut(req, res) {
        try {
            const data = await authService.logOut()
            res.status(200).json(data)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new authController()