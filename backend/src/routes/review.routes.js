import { Router } from 'express';
import { ReviewService } from '../services/review.service.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { db } from '../repositories/db.repository.js';

const router = Router();

// Get reviews for doctor (public)
router.get('/doctors/:doctorId', (req, res, next) => {
  try {
    const reviews = ReviewService.getDoctorReviews(req.params.doctorId);
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
});

// Submit review (patients only)
router.post('/submit', authenticate, authorize('patient'), async (req, res, next) => {
  try {
    const { appointmentId, rating, reviewText } = req.body;
    const review = await ReviewService.submitReview({
      appointmentId,
      patientId: req.user.patientId,
      rating,
      reviewText
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
});

export default router;
