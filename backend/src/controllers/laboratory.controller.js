import { LaboratoryService } from '../services/laboratory.service.js';

export class LaboratoryController {
  static async getDashboard(req, res, next) {
    try {
      const labId = req.user.labId;
      const data = LaboratoryService.getDashboard(labId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getServices(req, res, next) {
    try {
      const labId = req.user.labId;
      const services = LaboratoryService.getServices(labId);
      res.json({ success: true, services });
    } catch (err) {
      next(err);
    }
  }

  static async updateServiceOffering(req, res, next) {
    try {
      const labId = req.user.labId;
      const { testId, price, isAvailable, homeCollectionAvailable } = req.body;
      const updated = LaboratoryService.updateServiceOffering(labId, testId, price, isAvailable, homeCollectionAvailable);
      res.json({ success: true, offering: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getBookings(req, res, next) {
    try {
      const labId = req.user.labId;
      const bookings = LaboratoryService.getBookings(labId);
      res.json({ success: true, bookings });
    } catch (err) {
      next(err);
    }
  }

  static async updateBookingStatus(req, res, next) {
    try {
      const labId = req.user.labId;
      const bookingId = req.params.bookingId;
      const { status } = req.body;
      const updated = LaboratoryService.updateBookingStatus(labId, bookingId, status);
      res.json({ success: true, booking: updated });
    } catch (err) {
      next(err);
    }
  }

  static async uploadReport(req, res, next) {
    try {
      const labId = req.user.labId;
      const { patientId, testId, bookingId, reportTitle, description, reportDate, status, testResults } = req.body;
      const fileBuffer = req.file ? req.file.buffer : null;

      const parsedResults = typeof testResults === 'string' ? JSON.parse(testResults) : testResults;

      const report = await LaboratoryService.uploadReport({
        labId,
        patientIdentifier: patientId,
        testIdentifier: testId,
        bookingId,
        reportTitle,
        description,
        reportDate,
        status,
        testResults: parsedResults,
        fileBuffer
      });

      res.status(201).json({ success: true, report });
    } catch (err) {
      next(err);
    }
  }

  static async bookTest(req, res, next) {
    try {
      const patientId = req.user.patientId;
      const { labId, testId, date, timeSlot, collectionType, address, city } = req.body;
      const booking = await LaboratoryService.bookTest({
        patientId,
        labId,
        testId,
        date,
        timeSlot,
        collectionType,
        address,
        city
      });
      res.status(201).json({ success: true, booking });
    } catch (err) {
      next(err);
    }
  }
}
