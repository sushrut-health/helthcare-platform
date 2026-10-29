import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register/patient', AuthController.registerPatient);
router.post('/register/doctor', AuthController.registerDoctor);
router.post('/register/laboratory', AuthController.registerLaboratory);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
