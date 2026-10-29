import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { generateGrantId, generateRequestId } from '../utils/identifiers.js';
import { ForbiddenError, NotFoundError, BadRequestError } from '../utils/errors.js';

export class ConsentService {
  /**
   * Core Gatekeeper function:
   * Checks whether a doctor has an active, unexpired, unrevoked consent grant for a patient's records
   */
  static canDoctorAccessPatientRecords(doctorId, patientId) {
    const store = db.store;
    const grant = store.patientAccessGrants.find(g => 
      g.doctor_id === doctorId &&
      g.patient_id === patientId &&
      g.status === 'active'
    );

    if (!grant) {
      return { allowed: false, reason: 'No active patient consent grant found.' };
    }

    if (grant.expires_at && new Date(grant.expires_at) < new Date()) {
      grant.status = 'expired';
      return { allowed: false, reason: 'Patient consent grant has expired.' };
    }

    return { allowed: true, grant };
  }

  static async requestAccess({ doctorId, doctorName, patientId, appointmentId, purpose, requestedScope = 'all_records' }) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId || p.patient_id === patientId);
    if (!patient) throw new NotFoundError('Patient not found');

    // Check if there is already an active grant
    const activeGrant = store.patientAccessGrants.find(g =>
      g.doctor_id === doctorId && g.patient_id === patient.id && g.status === 'active'
    );
    if (activeGrant) {
      return { message: 'Active consent already exists', grant: activeGrant };
    }

    const requestId = generateRequestId();
    const newRequest = {
      id: uuidv4(),
      request_id: requestId,
      doctor_id: doctorId,
      doctor_name: doctorName || 'Consulting Physician',
      patient_id: patient.id,
      patient_name: patient.full_name,
      appointment_id: appointmentId || null,
      purpose: purpose || 'Clinical consultation review of historical medical records and test reports.',
      requested_scope: requestedScope,
      status: 'pending',
      requested_at: new Date().toISOString()
    };

    store.patientAccessRequests.push(newRequest);

    // Create in-app notification for patient
    store.notifications.push({
      id: uuidv4(),
      user_id: patient.user_id,
      title: 'Medical Record Access Request',
      message: `${doctorName || 'A doctor'} requested access to your medical records for consultation.`,
      type: 'consent',
      link_url: '/patient/profile',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return newRequest;
  }

  static async respondToRequest({ requestId, patientId, decision, scope = 'all_records' }) {
    const store = db.store;
    const req = store.patientAccessRequests.find(r => r.id === requestId && r.patient_id === patientId);
    if (!req) throw new NotFoundError('Access request not found or not owned by patient.');

    if (req.status !== 'pending') {
      throw new BadRequestError(`This request has already been ${req.status}.`);
    }

    req.status = decision === 'approve' ? 'approved' : 'rejected';
    req.responded_at = new Date().toISOString();

    let createdGrant = null;
    if (decision === 'approve') {
      const grantId = generateGrantId();
      createdGrant = {
        id: uuidv4(),
        grant_id: grantId,
        request_id: req.id,
        doctor_id: req.doctor_id,
        patient_id: patientId,
        scope,
        status: 'active',
        granted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString() // 30 days validity
      };
      store.patientAccessGrants.push(createdGrant);

      // Audit log
      store.auditLogs.push({
        id: uuidv4(),
        user_id: patientId,
        user_role: 'patient',
        action: 'PATIENT_CONSENT_GRANTED',
        resource_type: 'medical_records',
        resource_id: grantId,
        metadata: { doctor_id: req.doctor_id, scope }
      });
    }

    return { request: req, grant: createdGrant };
  }

  static async revokeGrant({ grantId, patientId, reason = 'Patient revoked consent' }) {
    const store = db.store;
    const grant = store.patientAccessGrants.find(g => g.id === grantId && g.patient_id === patientId);
    if (!grant) throw new NotFoundError('Consent grant not found or not owned by patient.');

    grant.status = 'revoked';
    grant.revoked_at = new Date().toISOString();
    grant.revocation_reason = reason;

    // Audit log
    store.auditLogs.push({
      id: uuidv4(),
      user_id: patientId,
      user_role: 'patient',
      action: 'PATIENT_CONSENT_REVOKED',
      resource_type: 'medical_records',
      resource_id: grant.grant_id,
      metadata: { doctor_id: grant.doctor_id, reason }
    });

    return { message: 'Consent grant successfully revoked.', grant };
  }

  static getPatientAccessStatus(patientId) {
    const store = db.store;
    const grants = store.patientAccessGrants
      .filter(g => g.patient_id === patientId)
      .map(g => {
        const doctor = store.doctors.find(d => d.id === g.doctor_id);
        return {
          ...g,
          doctor_name: doctor ? doctor.full_name : 'Physician',
          doctor_specialty: doctor ? doctor.specialty_name : 'Medicine'
        };
      });

    const requests = store.patientAccessRequests
      .filter(r => r.patient_id === patientId)
      .map(r => {
        const doctor = store.doctors.find(d => d.id === r.doctor_id);
        return {
          ...r,
          doctor_name: doctor ? doctor.full_name : 'Physician'
        };
      });

    return { grants, requests };
  }

  static getDoctorAccessRequests(doctorId) {
    const store = db.store;
    const requests = store.patientAccessRequests
      .filter(r => r.doctor_id === doctorId)
      .map(r => {
        const patient = store.patients.find(p => p.id === r.patient_id);
        return {
          ...r,
          patient_name: patient ? patient.full_name : 'Patient',
          patient_unique_id: patient ? patient.patient_id : ''
        };
      });

    const activeGrants = store.patientAccessGrants
      .filter(g => g.doctor_id === doctorId && g.status === 'active')
      .map(g => {
        const patient = store.patients.find(p => p.id === g.patient_id);
        return {
          ...g,
          patient_name: patient ? patient.full_name : 'Patient',
          patient_unique_id: patient ? patient.patient_id : ''
        };
      });

    return { requests, activeGrants };
  }
}
