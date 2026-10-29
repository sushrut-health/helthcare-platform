import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { generatePrescriptionFilename, validatePrescriptionFilename } from '../utils/filenames.js';
import { generateReportId } from '../utils/identifiers.js';
import { getStorageService } from './storage/index.js';
import { ConsentService } from './consent.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.js';

export class DoctorService {
  static getDashboard(doctorId) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found');

    const todayStr = new Date().toISOString().split('T')[0];
    const appointments = store.appointments.filter(a => a.doctor_id === doctor.id);

    const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);
    const upcomingAppointments = appointments
      .filter(a => a.appointment_date >= todayStr && a.status === 'confirmed')
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

    const pendingRequests = store.patientAccessRequests.filter(
      r => r.doctor_id === doctor.id && r.status === 'pending'
    );

    const reviews = store.doctorReviews.filter(r => r.doctor_id === doctor.id);

    return {
      doctor,
      stats: {
        todayAppointmentsCount: todayAppointments.length,
        upcomingAppointmentsCount: upcomingAppointments.length,
        totalAppointmentsCount: appointments.length,
        pendingAccessRequestsCount: pendingRequests.length,
        ratingAvg: doctor.rating_avg,
        totalReviews: doctor.total_reviews
      },
      todayAppointments,
      upcomingAppointments: upcomingAppointments.slice(0, 5),
      recentReviews: reviews.slice(0, 5),
      pendingAccessRequests: pendingRequests
    };
  }

  static getAvailability(doctorId) {
    const store = db.store;
    const rules = store.doctorAvailability.filter(a => a.doctor_id === doctorId);
    return rules;
  }

  static updateAvailability(doctorId, rules) {
    const store = db.store;
    // Replace doctor's weekly rules
    store.doctorAvailability = store.doctorAvailability.filter(a => a.doctor_id !== doctorId);

    const newRules = rules.map(r => ({
      id: uuidv4(),
      doctor_id: doctorId,
      day_of_week: r.dayOfWeek,
      start_time: r.startTime.length === 5 ? `${r.startTime}:00` : r.startTime,
      end_time: r.endTime.length === 5 ? `${r.endTime}:00` : r.endTime,
      slot_duration_minutes: r.slotDurationMinutes || 15,
      is_active: r.isActive !== false,
      created_at: new Date().toISOString()
    }));

    store.doctorAvailability.push(...newRules);
    return newRules;
  }

  /**
   * Protected Patient Record Access Gated by Consent
   */
  static getPatientRecordsForDoctor(doctorId, patientId) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor || doctor.verification_status !== 'approved') {
      throw new ForbiddenError('Doctor is not approved to access clinical patient records.');
    }

    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found.');

    // Enforce Patient-Controlled Consent Gatekeeper
    const consent = ConsentService.canDoctorAccessPatientRecords(doctor.id, patient.id);
    if (!consent.allowed) {
      throw new ForbiddenError(`Clinical records access denied: ${consent.reason}`);
    }

    // Return patient records
    const prescriptions = store.prescriptions.filter(p => p.patient_id === patient.id);
    const labReports = store.laboratoryReports.filter(r => r.patient_id === patient.id);

    return {
      patient,
      consentGrant: consent.grant,
      prescriptions,
      labReports
    };
  }

  /**
   * Create Prescription with required filename pattern:
   * PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
   */
  static async createPrescription({
    doctorId,
    appointmentId,
    patientId,
    diseaseId,
    medications,
    dosageInstructions,
    followUpDate,
    fileBuffer
  }) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found.');

    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found.');

    let disease = store.diseases.find(d => d.id === diseaseId || d.disease_id === diseaseId);
    if (!disease) {
      // Default fallback disease or create entry
      disease = store.diseases[0];
    }

    const recordId = generateReportId();
    // Filename pattern: PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
    const filename = generatePrescriptionFilename({
      patientId: patient.patient_id,
      diseaseId: disease.disease_id,
      doctorId: doctor.doctor_id,
      recordId
    });

    if (!validatePrescriptionFilename(filename)) {
      throw new BadRequestError(`Generated filename does not conform to specification: ${filename}`);
    }

    // Default valid minimal PDF buffer if none uploaded
    let bufferToStore = fileBuffer;
    if (!bufferToStore) {
      const sampleContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\ntrailer\n<< /Size 4 /Root 1 0 R >>\n%%EOF`;
      bufferToStore = Buffer.from(sampleContent, 'utf-8');
    }

    const storage = getStorageService();
    const stored = await storage.storeFile(filename, bufferToStore, 'application/pdf');

    const newPrescription = {
      id: uuidv4(),
      prescription_id: `PRX${Date.now().toString().slice(-6)}`,
      record_id: recordId,
      appointment_id: appointmentId || null,
      patient_id: patient.id,
      patient_unique_id: patient.patient_id,
      doctor_id: doctor.id,
      doctor_unique_id: doctor.doctor_id,
      doctor_name: doctor.full_name,
      disease_id: disease.id,
      disease_unique_id: disease.disease_id,
      disease_name: disease.name,
      medications: medications || [],
      dosage_instructions: dosageInstructions || '',
      follow_up_date: followUpDate || null,
      pdf_filename: stored.filename,
      pdf_storage_path: stored.storagePath,
      file_size_bytes: stored.fileSizeBytes,
      mime_type: 'application/pdf',
      created_at: new Date().toISOString()
    };

    store.prescriptions.push(newPrescription);

    // If linked to appointment, mark appointment completed
    if (appointmentId) {
      const apt = store.appointments.find(a => a.id === appointmentId);
      if (apt) {
        apt.status = 'completed';
      }
    }

    // Notify patient
    store.notifications.push({
      id: uuidv4(),
      user_id: patient.user_id,
      title: 'New Prescription Uploaded',
      message: `${doctor.full_name} has generated a new clinical prescription for you.`,
      type: 'report',
      link_url: '/patient/prescriptions',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return newPrescription;
  }
}
