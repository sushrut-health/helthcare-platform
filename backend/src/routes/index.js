import { Router } from 'express';
import authRoutes from './auth.routes.js';
import patientRoutes from './patient.routes.js';
import doctorRoutes from './doctor.routes.js';
import laboratoryRoutes from './laboratory.routes.js';
import adminRoutes from './admin.routes.js';
import directoryRoutes from './directory.routes.js';
import documentRoutes from './document.routes.js';
import reviewRoutes from './review.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

// Domain groups under /api/v1
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/laboratories', laboratoryRoutes);
router.use('/admin', adminRoutes);
router.use('/directory', directoryRoutes);
router.use('/documents', documentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Sushrut Healthcare Platform API',
    version: '1.0.0'
  });
});

export default router;
