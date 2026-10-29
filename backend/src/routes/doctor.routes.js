import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadPdf } from '../middleware/upload.middleware.js';

const router = Router();

// Gated by doctor role
router.use(authenticate);
router.use(authorize('doctor'));

router.get('/dashboard', DoctorController.getDashboard);
router.get('/appointments/today', DoctorController.getTodayAppointments);
router.get('/appointments', DoctorController.getAllAppointments);
router.get('/availability', DoctorController.getAvailability);
router.put('/availability', DoctorController.updateAvailability);
router.get('/access-requests', DoctorController.getAccessRequests);
router.post('/access-requests', DoctorController.requestPatientAccess);
router.get('/patients/:patientId/medical-records', DoctorController.getPatientMedicalRecords);
router.post('/prescriptions', uploadPdf.single('prescriptionPdf'), DoctorController.createPrescription);

export default router;
