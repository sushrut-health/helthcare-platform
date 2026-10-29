import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class AdminService {
  static getDashboard() {
    const store = db.store;

    const patientsCount = store.patients.length;
    const approvedDoctors = store.doctors.filter(d => d.verification_status === 'approved');
    const pendingDoctors = store.doctors.filter(d => d.verification_status === 'pending');
    const approvedLabs = store.laboratories.filter(l => l.verification_status === 'approved');
    const pendingLabs = store.laboratories.filter(l => l.verification_status === 'pending');
    const totalAppointments = store.appointments.length;
    const totalLabBookings = store.laboratoryBookings.length;

    return {
      stats: {
        registeredPatientsCount: patientsCount,
        approvedDoctorsCount: approvedDoctors.length,
        pendingDoctorsCount: pendingDoctors.length,
        approvedLabsCount: approvedLabs.length,
        pendingLabsCount: pendingLabs.length,
        totalAppointmentsCount: totalAppointments,
        totalLabBookingsCount: totalLabBookings
      },
      pendingDoctors: pendingDoctors.slice(0, 5),
      pendingLabs: pendingLabs.slice(0, 5),
      recentAuditLogs: store.auditLogs.slice(0, 8),
      recentAppointments: store.appointments.slice(0, 5)
    };
  }

  static getPendingDoctors() {
    const store = db.store;
    return store.doctors.filter(d => d.verification_status === 'pending');
  }

  static getDoctorVerificationDetails(doctorId) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId || d.doctor_id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found');
    return doctor;
  }

  static reviewDoctor({ doctorId, decision, notes, adminId }) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId || d.doctor_id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found');

    if (!['approved', 'rejected'].includes(decision)) {
      throw new BadRequestError('Decision must be "approved" or "rejected".');
    }

    doctor.verification_status = decision;
    doctor.verification_notes = notes || (decision === 'approved' ? 'Verified by Sushrut Admin' : 'Rejected');
    doctor.approved_at = decision === 'approved' ? new Date().toISOString() : null;
    doctor.approved_by = adminId;
    doctor.updated_at = new Date().toISOString();

    // Audit log
    store.auditLogs.push({
      id: uuidv4(),
      user_id: adminId,
      user_role: 'admin',
      action: `DOCTOR_VERIFICATION_${decision.toUpperCase()}`,
      resource_type: 'doctor',
      resource_id: doctor.doctor_id,
      metadata: { doctor_name: doctor.full_name, decision, notes },
      created_at: new Date().toISOString()
    });

    // Notify doctor
    store.notifications.push({
      id: uuidv4(),
      user_id: doctor.user_id,
      title: `Account Verification ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
      message: decision === 'approved' 
        ? 'Congratulations! Your doctor profile has been verified and is now live for patient appointments.'
        : `Your verification could not be approved at this time: ${notes}`,
      type: 'verification',
      link_url: '/doctor/dashboard',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return doctor;
  }

  static getPendingLaboratories() {
    const store = db.store;
    return store.laboratories.filter(l => l.verification_status === 'pending');
  }

  static getLaboratoryVerificationDetails(labId) {
    const store = db.store;
    const lab = store.laboratories.find(l => l.id === labId || l.lab_id === labId);
    if (!lab) throw new NotFoundError('Laboratory not found');
    return lab;
  }

  static reviewLaboratory({ labId, decision, notes, adminId }) {
    const store = db.store;
    const lab = store.laboratories.find(l => l.id === labId || l.lab_id === labId);
    if (!lab) throw new NotFoundError('Laboratory not found');

    if (!['approved', 'rejected'].includes(decision)) {
      throw new BadRequestError('Decision must be "approved" or "rejected".');
    }

    lab.verification_status = decision;
    lab.verification_notes = notes || (decision === 'approved' ? 'Accreditation verified by Sushrut Admin' : 'Rejected');
    lab.approved_at = decision === 'approved' ? new Date().toISOString() : null;
    lab.approved_by = adminId;
    lab.updated_at = new Date().toISOString();

    // Audit log
    store.auditLogs.push({
      id: uuidv4(),
      user_id: adminId,
      user_role: 'admin',
      action: `LAB_VERIFICATION_${decision.toUpperCase()}`,
      resource_type: 'laboratory',
      resource_id: lab.lab_id,
      metadata: { lab_name: lab.name, decision, notes },
      created_at: new Date().toISOString()
    });

    // Notify laboratory
    store.notifications.push({
      id: uuidv4(),
      user_id: lab.user_id,
      title: `Laboratory Accreditation ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
      message: decision === 'approved' 
        ? 'Your laboratory registration has been verified and approved to receive diagnostic bookings.'
        : `Accreditation verification decision: ${notes}`,
      type: 'verification',
      link_url: '/laboratory/dashboard',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return lab;
  }

  static getAllPatients() {
    const store = db.store;
    return store.patients.map(p => {
      const user = store.users.find(u => u.id === p.user_id);
      return {
        ...p,
        email: user ? user.email : '',
        is_active: user ? user.is_active : true
      };
    });
  }

  static getAllDoctors() {
    const store = db.store;
    return store.doctors.map(d => {
      const user = store.users.find(u => u.id === d.user_id);
      return {
        ...d,
        email: user ? user.email : '',
        is_active: user ? user.is_active : true
      };
    });
  }

  static getAllLaboratories() {
    const store = db.store;
    return store.laboratories.map(l => {
      const user = store.users.find(u => u.id === l.user_id);
      return {
        ...l,
        email: user ? user.email : '',
        is_active: user ? user.is_active : true
      };
    });
  }

  static getAuditLogs() {
    const store = db.store;
    return store.auditLogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}
