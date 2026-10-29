import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Gated by admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/doctors/pending', AdminController.getPendingDoctors);
router.get('/doctors/:doctorId/verification', AdminController.getDoctorVerificationDetails);
router.post('/doctors/:doctorId/review', AdminController.reviewDoctor);
router.get('/laboratories/pending', AdminController.getPendingLaboratories);
router.get('/laboratories/:labId/verification', AdminController.getLaboratoryVerificationDetails);
router.post('/laboratories/:labId/review', AdminController.reviewLaboratory);
router.get('/patients', AdminController.getAllPatients);
router.get('/doctors', AdminController.getAllDoctors);
router.get('/laboratories', AdminController.getAllLaboratories);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
