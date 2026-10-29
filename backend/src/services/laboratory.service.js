import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { generateLabReportFilename, validateLabReportFilename } from '../utils/filenames.js';
import { generateReportId, generateBookingId } from '../utils/identifiers.js';
import { getStorageService } from './storage/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class LaboratoryService {
  static getDashboard(labId) {
    const store = db.store;
    const lab = store.laboratories.find(l => l.id === labId);
    if (!lab) throw new NotFoundError('Laboratory not found');

    const bookings = store.laboratoryBookings.filter(b => b.lab_id === lab.id);
    const reports = store.laboratoryReports.filter(r => r.lab_id === lab.id);

    const pendingCollections = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');

    return {
      laboratory: lab,
      stats: {
        totalBookingsCount: bookings.length,
        pendingCollectionsCount: pendingCollections.length,
        completedBookingsCount: completedBookings.length,
        totalReportsUploadedCount: reports.length
      },
      recentBookings: bookings.slice(0, 5),
      recentReports: reports.slice(0, 5)
    };
  }

  static getServices(labId) {
    const store = db.store;
    const offerings = store.laboratoryOfferings.filter(o => o.lab_id === labId);
    return offerings.map(o => {
      const test = store.tests.find(t => t.id === o.test_id);
      return {
        ...o,
        test_name: test ? test.name : 'Diagnostic Test',
        test_id_code: test ? test.test_id : '',
        category: test ? test.category : 'General',
        sample_type: test ? test.sample_type : 'Blood'
      };
    });
  }

  static updateServiceOffering(labId, testId, price, isAvailable, homeCollectionAvailable) {
    const store = db.store;
    let offering = store.laboratoryOfferings.find(o => o.lab_id === labId && o.test_id === testId);
    if (!offering) {
      offering = {
        id: uuidv4(),
        lab_id: labId,
        test_id: testId,
        price: parseFloat(price),
        is_available: isAvailable !== false,
        home_collection_available: homeCollectionAvailable !== false
      };
      store.laboratoryOfferings.push(offering);
    } else {
      offering.price = parseFloat(price);
      offering.is_available = isAvailable;
      offering.home_collection_available = homeCollectionAvailable;
    }
    return offering;
  }

  static getBookings(labId) {
    const store = db.store;
    return store.laboratoryBookings
      .filter(b => b.lab_id === labId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static updateBookingStatus(labId, bookingId, status) {
    const store = db.store;
    const booking = store.laboratoryBookings.find(b => b.id === bookingId && b.lab_id === labId);
    if (!booking) throw new NotFoundError('Booking not found or not owned by this laboratory.');

    const allowed = ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${allowed.join(', ')}`);
    }

    booking.status = status;
    booking.updated_at = new Date().toISOString();
    return booking;
  }

  /**
   * Book a diagnostic test
   */
  static async bookTest({ patientId, labId, testId, date, timeSlot, collectionType, address, city }) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId);
    if (!patient) throw new NotFoundError('Patient not found.');

    const lab = store.laboratories.find(l => l.id === labId);
    if (!lab) throw new NotFoundError('Laboratory not found.');

    const test = store.tests.find(t => t.id === testId);
    if (!test) throw new NotFoundError('Test not found.');

    const offering = store.laboratoryOfferings.find(o => o.lab_id === lab.id && o.test_id === test.id);
    const testPrice = offering ? offering.price : test.default_price;
    const homeFee = collectionType === 'home_collection' ? lab.home_collection_fee : 0;
    const totalAmount = testPrice + homeFee;

    const bookingId = generateBookingId();
    const newBooking = {
      id: uuidv4(),
      booking_id: bookingId,
      patient_id: patient.id,
      patient_name: patient.full_name,
      lab_id: lab.id,
      lab_name: lab.name,
      test_id: test.id,
      test_name: test.name,
      booking_date: date,
      preferred_time_slot: timeSlot || 'Morning 8:00 AM - 11:00 AM',
      collection_type: collectionType || 'lab_visit',
      collection_address: address || patient.address,
      collection_city: city || patient.city,
      status: 'confirmed',
      total_amount: totalAmount,
      created_at: new Date().toISOString()
    };

    store.laboratoryBookings.push(newBooking);

    // Notify lab and patient
    store.notifications.push({
      id: uuidv4(),
      user_id: patient.user_id,
      title: 'Lab Test Booked',
      message: `Your booking for ${test.name} with ${lab.name} is confirmed for ${date}.`,
      type: 'report',
      link_url: '/patient/laboratory-reports',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return newBooking;
  }

  /**
   * Upload Laboratory Report with Required Filename:
   * PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
   */
  static async uploadReport({
    labId,
    patientIdentifier, // UUID or PAI100001
    testIdentifier,    // UUID or TST000001
    bookingId,
    reportTitle,
    description,
    reportDate,
    status = 'Normal',
    testResults = {},
    fileBuffer
  }) {
    const store = db.store;
    const lab = store.laboratories.find(l => l.id === labId);
    if (!lab) throw new NotFoundError('Authenticated laboratory not found.');

    const patient = store.patients.find(
      p => p.id === patientIdentifier || p.patient_id === patientIdentifier
    );
    if (!patient) throw new NotFoundError(`Patient with ID "${patientIdentifier}" not found.`);

    const test = store.tests.find(
      t => t.id === testIdentifier || t.test_id === testIdentifier
    );
    if (!test) throw new NotFoundError(`Test with ID "${testIdentifier}" not found.`);

    const reportId = generateReportId();
    // Required Filename Pattern: PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
    const filename = generateLabReportFilename({
      patientId: patient.patient_id,
      testId: test.test_id,
      labId: lab.lab_id,
      reportId
    });

    if (!validateLabReportFilename(filename)) {
      throw new BadRequestError(`Generated report filename does not match specification: ${filename}`);
    }

    // Default minimal valid PDF buffer if none uploaded
    let bufferToStore = fileBuffer;
    if (!bufferToStore) {
      const samplePdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\ntrailer\n<< /Size 4 /Root 1 0 R >>\n%%EOF`;
      bufferToStore = Buffer.from(samplePdf, 'utf-8');
    }

    const storage = getStorageService();
    const stored = await storage.storeFile(filename, bufferToStore, 'application/pdf');

    const newReport = {
      id: uuidv4(),
      report_id: reportId,
      lab_booking_id: bookingId || null,
      patient_id: patient.id,
      patient_unique_id: patient.patient_id,
      lab_id: lab.id,
      lab_unique_id: lab.lab_id,
      lab_name: lab.name,
      test_id: test.id,
      test_unique_id: test.test_id,
      test_name: test.name,
      report_title: reportTitle || `${test.name} Certified Report`,
      description: description || 'Clinical laboratory analysis report',
      report_date: reportDate || new Date().toISOString().split('T')[0],
      status: status || 'Normal',
      test_results: testResults,
      pdf_filename: stored.filename,
      pdf_storage_path: stored.storagePath,
      file_size_bytes: stored.fileSizeBytes,
      mime_type: 'application/pdf',
      created_at: new Date().toISOString()
    };

    store.laboratoryReports.push(newReport);

    // If linked to booking, complete the booking
    if (bookingId) {
      const b = store.laboratoryBookings.find(bk => bk.id === bookingId);
      if (b) {
        b.status = 'completed';
      }
    }

    // Notify patient
    store.notifications.push({
      id: uuidv4(),
      user_id: patient.user_id,
      title: 'Laboratory Report Available',
      message: `Your ${test.name} report from ${lab.name} is now available in your portal.`,
      type: 'report',
      link_url: '/patient/laboratory-reports',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return newReport;
  }
}
