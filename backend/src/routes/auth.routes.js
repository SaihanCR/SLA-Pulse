import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router()


router.post('/login', authController.logIn.bind(authController))
router.post('/logout', authController.logOut.bind(authController))

export default router