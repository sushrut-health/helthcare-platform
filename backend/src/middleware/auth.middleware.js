import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { db } from '../repositories/db.repository.js';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. Missing Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.accessTokenSecret);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired authentication token.');
    }

    // Attach user information to request
    req.user = decoded;

    // Attach role-specific profile IDs if present in store
    const store = db.store;
    if (decoded.role === 'patient') {
      const patient = store.patients.find(p => p.user_id === decoded.id);
      if (patient) {
        req.user.patientId = patient.id;
        req.user.patientUniqueId = patient.patient_id;
      }
    } else if (decoded.role === 'doctor') {
      const doctor = store.doctors.find(d => d.user_id === decoded.id);
      if (doctor) {
        req.user.doctorId = doctor.id;
        req.user.doctorUniqueId = doctor.doctor_id;
        req.user.verificationStatus = doctor.verification_status;
      }
    } else if (decoded.role === 'laboratory') {
      const lab = store.laboratories.find(l => l.user_id === decoded.id);
      if (lab) {
        req.user.labId = lab.id;
        req.user.labUniqueId = lab.lab_id;
        req.user.verificationStatus = lab.verification_status;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access Denied: Requires one of [${roles.join(', ')}] role.`));
    }
    next();
  };
}
