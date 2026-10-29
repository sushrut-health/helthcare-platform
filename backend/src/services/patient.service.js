import { db } from '../repositories/db.repository.js';
import { NotFoundError } from '../utils/errors.js';

export class PatientService {
  static getDashboard(patientId) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found');

    const todayStr = new Date().toISOString().split('T')[0];

    const appointments = store.appointments.filter(a => a.patient_id === patient.id);
    const upcomingAppointments = appointments
      .filter(a => a.appointment_date >= todayStr && a.status === 'confirmed')
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

    const pastAppointments = appointments
      .filter(a => a.appointment_date < todayStr || a.status === 'completed')
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

    const prescriptions = store.prescriptions
      .filter(p => p.patient_id === patient.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const labReports = store.laboratoryReports
      .filter(r => r.patient_id === patient.id)
      .sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

    const pendingRequests = store.patientAccessRequests
      .filter(r => r.patient_id === patient.id && r.status === 'pending');

    return {
      patient,
      stats: {
        upcomingAppointmentsCount: upcomingAppointments.length,
        totalPrescriptionsCount: prescriptions.length,
        totalLabReportsCount: labReports.length,
        pendingAccessRequestsCount: pendingRequests.length
      },
      upcomingAppointments: upcomingAppointments.slice(0, 3),
      pastAppointments: pastAppointments.slice(0, 3),
      mostRecentPrescription: prescriptions[0] || null,
      recentLabReports: labReports.slice(0, 3),
      pendingAccessRequests: pendingRequests
    };
  }

  static getProfile(patientId) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found');
    return patient;
  }

  static updateProfile(patientId, updates) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found');

    Object.assign(patient, {
      full_name: updates.fullName || patient.full_name,
      phone: updates.phone || patient.phone,
      dob: updates.dob || patient.dob,
      gender: updates.gender || patient.gender,
      blood_group: updates.bloodGroup || patient.blood_group,
      address: updates.address || patient.address,
      city: updates.city || patient.city,
      state: updates.state || patient.state,
      postal_code: updates.postalCode || patient.postal_code,
      emergency_contact_name: updates.emergencyContactName || patient.emergency_contact_name,
      emergency_contact_phone: updates.emergencyContactPhone || patient.emergency_contact_phone,
      allergies: updates.allergies || patient.allergies,
      chronic_conditions: updates.chronicConditions || patient.chronic_conditions,
      updated_at: new Date().toISOString()
    });

    return patient;
  }

  static getPrescriptions(patientId) {
    const store = db.store;
    return store.prescriptions
      .filter(p => p.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static getLabReports(patientId) {
    const store = db.store;
    return store.laboratoryReports
      .filter(r => r.patient_id === patientId)
      .sort((a, b) => new Date(b.report_date) - new Date(a.report_date));
  }

  static getMedicalRecords(patientId) {
    const store = db.store;
    const prescriptions = store.prescriptions.filter(p => p.patient_id === patientId);
    const reports = store.laboratoryReports.filter(r => r.patient_id === patientId);

    const records = [
      ...prescriptions.map(p => ({
        id: p.id,
        type: 'prescription',
        title: `Prescription - ${p.disease_name || 'General Consultation'}`,
        provider: p.doctor_name,
        date: p.created_at.split('T')[0],
        documentId: p.id,
        filename: p.pdf_filename,
        category: 'Prescription'
      })),
      ...reports.map(r => ({
        id: r.id,
        type: 'lab_report',
        title: r.report_title,
        provider: r.lab_name,
        date: r.report_date,
        documentId: r.id,
        filename: r.pdf_filename,
        category: 'Diagnostic Report',
        status: r.status
      }))
    ];

    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}
