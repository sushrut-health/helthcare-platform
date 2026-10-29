import { PatientService } from '../services/patient.service.js';
import { AppointmentService } from '../services/appointment.service.js';
import { ConsentService } from '../services/consent.service.js';

export class PatientController {
  static async getDashboard(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const data = PatientService.getDashboard(patientId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const profile = PatientService.getProfile(patientId);
      res.json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const updated = PatientService.updateProfile(patientId, req.body);
      res.json({ success: true, profile: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getAppointments(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const appointments = AppointmentService.getPatientAppointments(patientId);
      res.json({ success: true, appointments });
    } catch (err) {
      next(err);
    }
  }

  static async bookAppointment(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const { doctorId, date, startTime, consultationType, symptoms } = req.body;
      const appointment = await AppointmentService.bookAppointment({
        patientId,
        doctorId,
        date,
        startTime,
        consultationType,
        symptoms
      });
      res.status(201).json({ success: true, appointment });
    } catch (err) {
      next(err);
    }
  }

  static async cancelAppointment(req, res, next) {
    try {
      const appointmentId = req.params.appointmentId;
      const { reason } = req.body;
      const result = await AppointmentService.cancelAppointment(appointmentId, req.user.id, 'patient', reason);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getMedicalRecords(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const records = PatientService.getMedicalRecords(patientId);
      res.json({ success: true, records });
    } catch (err) {
      next(err);
    }
  }

  static async getPrescriptions(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const prescriptions = PatientService.getPrescriptions(patientId);
      res.json({ success: true, prescriptions });
    } catch (err) {
      next(err);
    }
  }

  static async getLabReports(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const reports = PatientService.getLabReports(patientId);
      res.json({ success: true, reports });
    } catch (err) {
      next(err);
    }
  }

  static async getConsentStatus(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const data = ConsentService.getPatientAccessStatus(patientId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async respondToAccessRequest(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const { requestId, decision, scope } = req.body;
      const result = await ConsentService.respondToRequest({ requestId, patientId, decision, scope });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async revokeConsent(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const { grantId, reason } = req.body;
      const result = await ConsentService.revokeGrant({ grantId, patientId, reason });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
