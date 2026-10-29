import { AdminService } from '../services/admin.service.js';

export class AdminController {
  static async getDashboard(req, res, next) {
    try {
      const data = AdminService.getDashboard();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getPendingDoctors(req, res, next) {
    try {
      const doctors = AdminService.getPendingDoctors();
      res.json({ success: true, doctors });
    } catch (err) {
      next(err);
    }
  }

  static async getDoctorVerificationDetails(req, res, next) {
    try {
      const doctor = AdminService.getDoctorVerificationDetails(req.params.doctorId);
      res.json({ success: true, doctor });
    } catch (err) {
      next(err);
    }
  }

  static async reviewDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { decision, notes } = req.body;
      const doctor = AdminService.reviewDoctor({ doctorId, decision, notes, adminId: req.user.id });
      res.json({ success: true, doctor });
    } catch (err) {
      next(err);
    }
  }

  static async getPendingLaboratories(req, res, next) {
    try {
      const laboratories = AdminService.getPendingLaboratories();
      res.json({ success: true, laboratories });
    } catch (err) {
      next(err);
    }
  }

  static async getLaboratoryVerificationDetails(req, res, next) {
    try {
      const lab = AdminService.getLaboratoryVerificationDetails(req.params.labId);
      res.json({ success: true, laboratory: lab });
    } catch (err) {
      next(err);
    }
  }

  static async reviewLaboratory(req, res, next) {
    try {
      const { labId } = req.params;
      const { decision, notes } = req.body;
      const lab = AdminService.reviewLaboratory({ labId, decision, notes, adminId: req.user.id });
      res.json({ success: true, laboratory: lab });
    } catch (err) {
      next(err);
    }
  }

  static async getAllPatients(req, res, next) {
    try {
      const patients = AdminService.getAllPatients();
      res.json({ success: true, patients });
    } catch (err) {
      next(err);
    }
  }

  static async getAllDoctors(req, res, next) {
    try {
      const doctors = AdminService.getAllDoctors();
      res.json({ success: true, doctors });
    } catch (err) {
      next(err);
    }
  }

  static async getAllLaboratories(req, res, next) {
    try {
      const laboratories = AdminService.getAllLaboratories();
      res.json({ success: true, laboratories });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req, res, next) {
    try {
      const auditLogs = AdminService.getAuditLogs();
      res.json({ success: true, auditLogs });
    } catch (err) {
      next(err);
    }
  }
}
