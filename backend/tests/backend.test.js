import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
import { generateLabReportFilename, generatePrescriptionFilename, validateLabReportFilename, validatePrescriptionFilename } from '../src/utils/filenames.js';
import { ConsentService } from '../src/services/consent.service.js';
import { AppointmentService } from '../src/services/appointment.service.js';

describe('Sushrut Healthcare Platform - Core Business Logic & API Tests', () => {

  test('1. Identifier & Filename Specification Adherence', () => {
    // Section 11.5: PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
    const labFilename = generateLabReportFilename({
      patientId: 'PAI100001',
      testId: 'TST000001',
      labId: 'LAB100001',
      reportId: 'RPT000001'
    });
    assert.equal(labFilename, 'PAI100001-TST000001-LAB100001-RPT000001.pdf');
    assert.equal(validateLabReportFilename(labFilename), true);

    // Section 11.6: PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
    const rxFilename = generatePrescriptionFilename({
      patientId: 'PAI100001',
      diseaseId: 'DIS000001',
      doctorId: 'DOC100001',
      recordId: 'RPT000001'
    });
    assert.equal(rxFilename, 'PAI100001-DIS000001-DOC100001-RPT000001.pdf');
    assert.equal(validatePrescriptionFilename(rxFilename), true);
  });

  test('2. Health Check API endpoint returns healthy', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
  });

  test('3. Authentication: Login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'patient@sushrut.com', password: 'Password@123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.accessToken);
    assert.equal(res.body.user.role, 'patient');
    assert.equal(res.body.user.uniqueId, 'PAI100001');
  });

  test('4. Patient Registration: issues PAI prefix identifier', async () => {
    const uniqueEmail = `test.patient.${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register/patient')
      .send({
        fullName: 'Dev Testing Patient',
        email: uniqueEmail,
        password: 'Password@123',
        phone: '+91 99999 88888',
        city: 'Mumbai'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.user.patientUniqueId.startsWith('PAI'));
  });

  test('5. Doctor Registration: sets pending status & DOC prefix', async () => {
    const uniqueEmail = `test.doctor.${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register/doctor')
      .send({
        fullName: 'Dr. New Applicant',
        email: uniqueEmail,
        password: 'Password@123',
        specialty: 'Cardiologist',
        qualifications: 'MBBS, MD',
        registrationNumber: 'MCI-2024-99881',
        clinicName: 'Hope Heart Centre',
        clinicAddress: 'Dadar West',
        consultationFee: 750
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.doctor.verificationStatus, 'pending');
    assert.ok(res.body.doctor.doctorId.startsWith('DOC'));
  });

  test('6. Concurrency & Double Booking Prevention', async () => {
    // Get doc-001 (approved)
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const slotTime = '11:00';

    // Book first time
    const res1 = await AppointmentService.bookAppointment({
      patientId: 'pat-001',
      doctorId: 'doc-001',
      date: tomorrow,
      startTime: slotTime,
      symptoms: 'Checkup 1'
    });
    assert.ok(res1.appointment_id);

    // Second booking attempt on the exact same doctor, date and slot must fail with ConflictError
    await assert.rejects(
      async () => {
        await AppointmentService.bookAppointment({
          patientId: 'pat-002',
          doctorId: 'doc-001',
          date: tomorrow,
          startTime: slotTime,
          symptoms: 'Checkup 2 conflict'
        });
      },
      (err) => err.statusCode === 409
    );
  });

  test('7. Patient-Controlled Consent Gatekeeper (Request -> Grant -> Access -> Revoke -> Deny)', async () => {
    const doctorId = 'doc-003'; // Dr. Priya Nair
    const patientId = 'pat-002'; // Priya Sharma

    // Step A: Initially doctor has NO consent
    const check1 = ConsentService.canDoctorAccessPatientRecords(doctorId, patientId);
    assert.equal(check1.allowed, false);

    // Step B: Doctor requests access
    const req = await ConsentService.requestAccess({
      doctorId,
      doctorName: 'Dr. Priya Nair',
      patientId,
      purpose: 'Dermatological examination'
    });
    assert.equal(req.status, 'pending');

    // Step C: Patient approves access request
    const respondRes = await ConsentService.respondToRequest({
      requestId: req.id,
      patientId,
      decision: 'approve'
    });
    assert.equal(respondRes.request.status, 'approved');
    assert.ok(respondRes.grant);

    // Step D: Now access is ALLOWED
    const check2 = ConsentService.canDoctorAccessPatientRecords(doctorId, patientId);
    assert.equal(check2.allowed, true);

    // Step E: Patient revokes access
    const revokeRes = await ConsentService.revokeGrant({
      grantId: respondRes.grant.id,
      patientId,
      reason: 'Consultation finished'
    });
    assert.equal(revokeRes.grant.status, 'revoked');

    // Step F: Access is now strictly DENIED after revocation
    const check3 = ConsentService.canDoctorAccessPatientRecords(doctorId, patientId);
    assert.equal(check3.allowed, false);
  });

});
