import { db } from '../repositories/db.repository.js';
import { getStorageService } from '../services/storage/index.js';
import { ConsentService } from '../services/consent.service.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export class DocumentController {
  static async getDocument(req, res, next) {
    try {
      const { documentId } = req.params;
      const user = req.user;
      const store = db.store;

      // Find record: can be a prescription or a lab report
      let record = store.prescriptions.find(p => p.id === documentId || p.pdf_filename === documentId);
      let recordType = 'prescription';

      if (!record) {
        record = store.laboratoryReports.find(r => r.id === documentId || r.pdf_filename === documentId);
        recordType = 'lab_report';
      }

      if (!record) {
        throw new NotFoundError('Medical document record not found.');
      }

      // Authorization Gatekeeper Check:
      if (user.role === 'patient') {
        if (record.patient_id !== user.patientId) {
          throw new ForbiddenError('You do not have authorization to access this patient medical document.');
        }
      } else if (user.role === 'doctor') {
        const consent = ConsentService.canDoctorAccessPatientRecords(user.doctorId, record.patient_id);
        if (!consent.allowed) {
          throw new ForbiddenError(`Access denied: ${consent.reason}`);
        }
      } else if (user.role === 'laboratory') {
        if (recordType !== 'lab_report' || record.lab_id !== user.labId) {
          throw new ForbiddenError('Laboratories can only access reports issued by their own laboratory.');
        }
      } else if (user.role === 'admin') {
        throw new ForbiddenError('Administrative policy blocks direct clinical document content retrieval.');
      }

      // Retrieve file from external storage adapter
      const storage = getStorageService();
      const fileBuffer = await storage.retrieveFile(record.pdf_filename);

      if (!fileBuffer) {
        throw new NotFoundError('Underlying document file is currently unavailable in storage.');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${record.pdf_filename}"`);
      res.send(fileBuffer);
    } catch (err) {
      next(err);
    }
  }

  static async getDocumentMetadata(req, res, next) {
    try {
      const { documentId } = req.params;
      const store = db.store;

      let record = store.prescriptions.find(p => p.id === documentId || p.pdf_filename === documentId);
      let recordType = 'prescription';

      if (!record) {
        record = store.laboratoryReports.find(r => r.id === documentId || r.pdf_filename === documentId);
        recordType = 'lab_report';
      }

      if (!record) throw new NotFoundError('Document not found');

      res.json({
        success: true,
        document: {
          id: record.id,
          type: recordType,
          filename: record.pdf_filename,
          patientUniqueId: record.patient_unique_id,
          createdAt: record.created_at,
          fileSizeBytes: record.file_size_bytes || 845,
          mimeType: record.mime_type || 'application/pdf'
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
