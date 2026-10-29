import { DoctorService } from '../services/doctor.service.js';
import { AppointmentService } from '../services/appointment.service.js';
import { ConsentService } from '../services/consent.service.js';

export class DoctorController {
  static async getDashboard(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const data = DoctorService.getDashboard(doctorId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getTodayAppointments(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const todayStr = new Date().toISOString().split('T')[0];
      const appointments = AppointmentService.getDoctorAppointments(doctorId, todayStr);
      res.json({ success: true, appointments });
    } catch (err) {
      next(err);
    }
  }

  static async getAllAppointments(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const appointments = AppointmentService.getDoctorAppointments(doctorId);
      res.json({ success: true, appointments });
    } catch (err) {
      next(err);
    }
  }

  static async getAvailability(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const availability = DoctorService.getAvailability(doctorId);
      res.json({ success: true, availability });
    } catch (err) {
      next(err);
    }
  }

  static async updateAvailability(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const { rules } = req.body;
      const updated = DoctorService.updateAvailability(doctorId, rules);
      res.json({ success: true, availability: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getAccessRequests(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const data = ConsentService.getDoctorAccessRequests(doctorId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async requestPatientAccess(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const { patientId, appointmentId, purpose, requestedScope } = req.body;
      const doctorName = req.user.profile ? req.user.profile.full_name : 'Dr. Consultant';
      const request = await ConsentService.requestAccess({
        doctorId,
        doctorName,
        patientId,
        appointmentId,
        purpose,
        requestedScope
      });
      res.status(201).json({ success: true, request });
    } catch (err) {
      next(err);
    }
  }

  static async getPatientMedicalRecords(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const patientId = req.params.patientId;
      const data = DoctorService.getPatientRecordsForDoctor(doctorId, patientId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createPrescription(req, res, next) {
    try {
      const doctorId = req.user.doctorId;
      const { appointmentId, patientId, diseaseId, medications, dosageInstructions, followUpDate } = req.body;
      const fileBuffer = req.file ? req.file.buffer : null;

      const parsedMedications = typeof medications === 'string' ? JSON.parse(medications) : medications;

      const prescription = await DoctorService.createPrescription({
        doctorId,
        appointmentId,
        patientId,
        diseaseId,
        medications: parsedMedications,
        dosageInstructions,
        followUpDate,
        fileBuffer
      });

      res.status(201).json({ success: true, prescription });
    } catch (err) {
      next(err);
    }
  }
}
