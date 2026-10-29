import { db } from '../repositories/db.repository.js';
import { AppointmentService } from '../services/appointment.service.js';
import { NotFoundError } from '../utils/errors.js';

export class DirectoryController {
  static getSpecialties(req, res, next) {
    try {
      const store = db.store;
      const specialties = store.specialties.filter(s => s.is_active);
      res.json({ success: true, specialties });
    } catch (err) {
      next(err);
    }
  }

  static getDoctors(req, res, next) {
    try {
      const store = db.store;
      const { specialty, query, location, minRating } = req.query;

      // Only show approved doctors
      let doctors = store.doctors.filter(d => d.verification_status === 'approved');

      if (specialty) {
        doctors = doctors.filter(d => 
          (d.specialty_name && d.specialty_name.toLowerCase().includes(specialty.toLowerCase())) ||
          (d.primary_specialty_id === specialty)
        );
      }

      if (query) {
        const q = query.toLowerCase();
        doctors = doctors.filter(d => 
          d.full_name.toLowerCase().includes(q) ||
          d.clinic_name.toLowerCase().includes(q) ||
          d.qualifications.toLowerCase().includes(q)
        );
      }

      if (location) {
        const loc = location.toLowerCase();
        doctors = doctors.filter(d => 
          d.city.toLowerCase().includes(loc) ||
          d.clinic_address.toLowerCase().includes(loc)
        );
      }

      if (minRating) {
        const min = parseFloat(minRating);
        doctors = doctors.filter(d => d.rating_avg >= min);
      }

      res.json({ success: true, doctors });
    } catch (err) {
      next(err);
    }
  }

  static getDoctorById(req, res, next) {
    try {
      const { doctorId } = req.params;
      const store = db.store;
      const doctor = store.doctors.find(d => d.id === doctorId || d.doctor_id === doctorId);
      if (!doctor) throw new NotFoundError('Doctor not found');

      const reviews = store.doctorReviews.filter(r => r.doctor_id === doctor.id);
      res.json({ success: true, doctor, reviews });
    } catch (err) {
      next(err);
    }
  }

  static getDoctorSlots(req, res, next) {
    try {
      const { doctorId } = req.params;
      const date = req.query.date || new Date().toISOString().split('T')[0];
      const data = AppointmentService.getDoctorSlotsForDate(doctorId, date);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static getLaboratories(req, res, next) {
    try {
      const store = db.store;
      const { query, location, testId, homeCollection } = req.query;

      // Only show approved laboratories
      let labs = store.laboratories.filter(l => l.verification_status === 'approved');

      if (query) {
        const q = query.toLowerCase();
        labs = labs.filter(l => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
      }

      if (location) {
        const loc = location.toLowerCase();
        labs = labs.filter(l => l.city.toLowerCase().includes(loc) || l.address.toLowerCase().includes(loc));
      }

      if (homeCollection === 'true') {
        labs = labs.filter(l => l.provides_home_collection);
      }

      res.json({ success: true, laboratories: labs });
    } catch (err) {
      next(err);
    }
  }

  static getLaboratoryById(req, res, next) {
    try {
      const { laboratoryId } = req.params;
      const store = db.store;
      const lab = store.laboratories.find(l => l.id === laboratoryId || l.lab_id === laboratoryId);
      if (!lab) throw new NotFoundError('Laboratory not found');

      // Fetch lab tests & offerings
      const offerings = store.laboratoryOfferings.filter(o => o.lab_id === lab.id);
      const testList = offerings.map(o => {
        const t = store.tests.find(test => test.id === o.test_id);
        return {
          ...o,
          test: t
        };
      });

      res.json({ success: true, laboratory: lab, offerings: testList });
    } catch (err) {
      next(err);
    }
  }

  static getTests(req, res, next) {
    try {
      const store = db.store;
      const { category, query } = req.query;
      let tests = store.tests.filter(t => t.is_active);

      if (category) {
        tests = tests.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
      }

      if (query) {
        const q = query.toLowerCase();
        tests = tests.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      }

      res.json({ success: true, tests });
    } catch (err) {
      next(err);
    }
  }
}
