import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors.js';

export class ReviewService {
  static getDoctorReviews(doctorId) {
    const store = db.store;
    return store.doctorReviews.filter(r => r.doctor_id === doctorId);
  }

  static async submitReview({ appointmentId, patientId, rating, reviewText }) {
    const store = db.store;
    const apt = store.appointments.find(a => a.id === appointmentId && a.patient_id === patientId);
    if (!apt) throw new NotFoundError('Appointment not found or not owned by patient.');

    if (apt.status !== 'completed' && apt.status !== 'confirmed') {
      throw new BadRequestError('Only completed consultations can be reviewed.');
    }

    const existingReview = store.doctorReviews.find(r => r.appointment_id === appointmentId);
    if (existingReview) {
      throw new ConflictError('A review has already been submitted for this appointment.');
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
      throw new BadRequestError('Rating must be an integer between 1 and 10.');
    }

    const patient = store.patients.find(p => p.id === patientId);
    const doctor = store.doctors.find(d => d.id === apt.doctor_id);

    const newReview = {
      id: uuidv4(),
      appointment_id: appointmentId,
      doctor_id: apt.doctor_id,
      patient_id: patientId,
      patient_name: patient ? `${patient.full_name.split(' ')[0]} ${patient.full_name.split(' ')[1] ? patient.full_name.split(' ')[1][0] + '.' : ''}` : 'Patient',
      rating: parsedRating,
      review_text: reviewText || '',
      created_at: new Date().toISOString()
    };

    store.doctorReviews.push(newReview);

    // Recalculate doctor average rating
    if (doctor) {
      const allDoctorReviews = store.doctorReviews.filter(r => r.doctor_id === doctor.id);
      const sum = allDoctorReviews.reduce((acc, r) => acc + r.rating, 0);
      doctor.rating_avg = parseFloat((sum / allDoctorReviews.length).toFixed(1));
      doctor.total_reviews = allDoctorReviews.length;
    }

    return newReview;
  }
}
