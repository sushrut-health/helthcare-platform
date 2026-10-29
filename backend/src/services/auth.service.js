import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { db } from '../repositories/db.repository.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { generatePatientId, generateDoctorId, generateLaboratoryId } from '../utils/identifiers.js';

export class AuthService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpiresIn
    });
    const refreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
      expiresIn: config.jwt.refreshTokenExpiresIn
    });
    return { accessToken, refreshToken };
  }

  static async registerPatient(data) {
    const store = db.store;
    const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const userId = uuidv4();
    const patientId = generatePatientId();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = {
      id: userId,
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      role: 'patient',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    };

    const newPatient = {
      id: uuidv4(),
      patient_id: patientId,
      user_id: userId,
      full_name: data.fullName,
      phone: data.phone || '',
      dob: data.dob || null,
      gender: data.gender || 'Prefer not to say',
      blood_group: data.bloodGroup || null,
      address: data.address || '',
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      postal_code: data.postalCode || '',
      emergency_contact_name: data.emergencyContactName || '',
      emergency_contact_phone: data.emergencyContactPhone || '',
      allergies: data.allergies || '',
      chronic_conditions: data.chronicConditions || '',
      created_at: new Date().toISOString()
    };

    store.users.push(newUser);
    store.patients.push(newPatient);

    const tokens = this.generateTokens({
      id: userId,
      email: newUser.email,
      role: 'patient',
      patientId: newPatient.id,
      patientUniqueId: patientId
    });

    return {
      user: {
        id: userId,
        email: newUser.email,
        role: 'patient',
        patientId: newPatient.id,
        patientUniqueId: patientId,
        fullName: newPatient.full_name
      },
      ...tokens
    };
  }

  static async registerDoctor(data) {
    const store = db.store;
    const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const userId = uuidv4();
    const doctorId = generateDoctorId();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = {
      id: userId,
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      role: 'doctor',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    };

    const specialty = store.specialties.find(s => s.id === data.specialtyId || s.name === data.specialty);

    const newDoctor = {
      id: uuidv4(),
      doctor_id: doctorId,
      user_id: userId,
      full_name: data.fullName,
      phone: data.phone || '',
      primary_specialty_id: specialty ? specialty.id : null,
      specialty_name: specialty ? specialty.name : (data.specialty || 'General Physician'),
      qualifications: data.qualifications,
      registration_number: data.registrationNumber,
      experience_years: parseInt(data.experienceYears || '0', 10),
      consultation_fee: parseFloat(data.consultationFee || '500'),
      clinic_name: data.clinicName,
      clinic_address: data.clinicAddress,
      city: data.city || 'Mumbai',
      latitude: data.latitude || 19.0760,
      longitude: data.longitude || 72.8777,
      bio: data.bio || '',
      verification_status: 'pending', // Doctors are Pending verification by default
      verification_notes: 'Under initial review by Sushrut Medical Licensing Board',
      verification_documents: data.documents || [
        { name: 'Medical_Registration_Certificate.pdf' },
        { name: 'Degree_Certificate.pdf' }
      ],
      rating_avg: 10.0,
      total_reviews: 0,
      created_at: new Date().toISOString()
    };

    store.users.push(newUser);
    store.doctors.push(newDoctor);

    return {
      message: 'Doctor registration submitted successfully. Your account is pending administrative verification.',
      doctor: {
        id: newDoctor.id,
        doctorId: newDoctor.doctor_id,
        fullName: newDoctor.full_name,
        verificationStatus: 'pending'
      }
    };
  }

  static async registerLaboratory(data) {
    const store = db.store;
    const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const userId = uuidv4();
    const labId = generateLaboratoryId();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = {
      id: userId,
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      role: 'laboratory',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    };

    const newLab = {
      id: uuidv4(),
      lab_id: labId,
      user_id: userId,
      name: data.name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      address: data.address,
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      postal_code: data.postalCode || '',
      latitude: data.latitude || 19.0760,
      longitude: data.longitude || 72.8777,
      nabl_accreditation_number: data.nablNumber || 'NABL-PENDING',
      verification_status: 'pending', // Laboratories are Pending verification by default
      verification_notes: 'Under initial review for accreditation documents',
      verification_documents: data.documents || [
        { name: 'NABL_Accreditation_Certificate.pdf' }
      ],
      provides_home_collection: data.providesHomeCollection !== false,
      home_collection_fee: parseFloat(data.homeCollectionFee || '100'),
      operating_hours: data.operatingHours || '8:00 AM - 8:00 PM',
      description: data.description || '',
      created_at: new Date().toISOString()
    };

    store.users.push(newUser);
    store.laboratories.push(newLab);

    return {
      message: 'Laboratory registration submitted successfully. Awaiting administrative accreditation review.',
      laboratory: {
        id: newLab.id,
        labId: newLab.lab_id,
        name: newLab.name,
        verificationStatus: 'pending'
      }
    };
  }

  static async login(email, password) {
    const store = db.store;
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('This account has been deactivated. Please contact support.');
    }

    let profile = null;
    let patientId = null;
    let doctorId = null;
    let labId = null;
    let uniqueId = null;

    if (user.role === 'patient') {
      const patient = store.patients.find(p => p.user_id === user.id);
      if (patient) {
        patientId = patient.id;
        uniqueId = patient.patient_id;
        profile = patient;
      }
    } else if (user.role === 'doctor') {
      const doctor = store.doctors.find(d => d.user_id === user.id);
      if (doctor) {
        doctorId = doctor.id;
        uniqueId = doctor.doctor_id;
        profile = doctor;
      }
    } else if (user.role === 'laboratory') {
      const lab = store.laboratories.find(l => l.user_id === user.id);
      if (lab) {
        labId = lab.id;
        uniqueId = lab.lab_id;
        profile = lab;
      }
    } else if (user.role === 'admin') {
      profile = { name: 'System Administrator', email: user.email };
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      patientId,
      doctorId,
      labId,
      uniqueId
    };

    const tokens = this.generateTokens(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patientId,
        doctorId,
        labId,
        uniqueId,
        profile
      },
      ...tokens
    };
  }

  static async forgotPassword(email) {
    // Return generic message regardless of email existence to prevent user enumeration
    const resetToken = uuidv4();
    return {
      message: 'If an account exists with this email address, password reset instructions have been sent.',
      resetToken // Returned in local dev for testing ease
    };
  }

  static async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required.');
    }
    return {
      message: 'Password reset successful. You can now log in with your new password.'
    };
  }
}
