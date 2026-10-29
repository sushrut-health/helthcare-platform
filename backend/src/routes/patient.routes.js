import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Gated by patient role
router.use(authenticate);
router.use(authorize('patient'));

router.get('/dashboard', PatientController.getDashboard);
router.get('/profile', PatientController.getProfile);
router.put('/profile', PatientController.updateProfile);
router.get('/appointments', PatientController.getAppointments);
router.post('/appointments/book', PatientController.bookAppointment);
router.post('/appointments/:appointmentId/cancel', PatientController.cancelAppointment);
router.get('/medical-records', PatientController.getMedicalRecords);
router.get('/prescriptions', PatientController.getPrescriptions);
router.get('/laboratory-reports', PatientController.getLabReports);
router.get('/consent', PatientController.getConsentStatus);
router.post('/consent/respond', PatientController.respondToAccessRequest);
router.post('/consent/revoke', PatientController.revokeConsent);

export default router;
