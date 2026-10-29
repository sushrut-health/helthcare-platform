import { Router } from 'express';
import { LaboratoryController } from '../controllers/laboratory.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadPdf } from '../middleware/upload.middleware.js';

const router = Router();

// Gated by laboratory role
router.use(authenticate);
router.use(authorize('laboratory'));

router.get('/dashboard', LaboratoryController.getDashboard);
router.get('/services', LaboratoryController.getServices);
router.post('/services', LaboratoryController.updateServiceOffering);
router.get('/bookings', LaboratoryController.getBookings);
router.patch('/bookings/:bookingId/status', LaboratoryController.updateBookingStatus);
router.post('/reports/upload', uploadPdf.single('reportPdf'), LaboratoryController.uploadReport);

export default router;
