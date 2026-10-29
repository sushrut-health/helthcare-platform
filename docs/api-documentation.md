# Sushrut Healthcare Platform - REST API Documentation

## 1. API Architecture Overview

The **Sushrut Healthcare Platform** backend exposes a structured, RESTful API mounted at the `/api/v1` namespace.

- **Base URL:** `http://localhost:5000/api/v1` (configurable via `PORT` environment variable)
- **Protocol:** HTTP/1.1 and HTTP/2 compatible
- **Payload Format:** JSON (`Content-Type: application/json`), except multipart file uploads (`multipart/form-data`) and binary PDF streams (`application/pdf`)
- **Authentication:** Stateless JSON Web Tokens (JWT) transmitted via standard HTTP Authorization headers:
  ```http
  Authorization: Bearer <access_token>
  ```

---

## 2. Standard Response Envelopes

### 2.1 Success Response (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### 2.2 Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "error": "Error title or category",
  "message": "Specific explanation of the failure condition"
}
```

---

## 3. API Endpoints Directory

### 3.1 Health Check

#### `GET /api/v1/health`
Checks backend service availability and version status.
- **Auth Required:** No
- **Response `200 OK`:**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-29T10:00:00.000Z",
  "service": "Sushrut Healthcare Platform API",
  "version": "1.0.0"
}
```

---

### 3.2 Authentication & Account Management (`/api/v1/auth`)

#### `POST /api/v1/auth/register/patient`
Registers a new patient account with demographic details.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "john.patient@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "phone": "+91 98765 43210",
  "dob": "1988-06-15",
  "gender": "Male",
  "bloodGroup": "O+",
  "city": "Mumbai",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+91 98765 43211",
  "allergies": "Penicillin",
  "chronicConditions": "Type 2 Diabetes"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john.patient@example.com",
    "role": "patient",
    "patientId": "PAI100001",
    "fullName": "John Doe"
  }
}
```

#### `POST /api/v1/auth/register/doctor`
Registers a new doctor account with credentials requiring admin review.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "dr.smith@example.com",
  "password": "SecurePassword123!",
  "fullName": "Dr. Sarah Smith",
  "phone": "+91 91234 56789",
  "specialtyId": "uuid-specialty",
  "qualifications": "MBBS, MD (Medicine)",
  "registrationNumber": "MCI-48291",
  "experienceYears": 12,
  "consultationFee": 800.00,
  "clinicName": "City Endocrinology Clinic",
  "clinicAddress": "Suite 401, Apollo Road, Mumbai",
  "city": "Mumbai",
  "bio": "Specialist in metabolic disorders and chronic care."
}
```
- **Response `201 Created`:** Verification status starts at `pending`.

#### `POST /api/v1/auth/register/laboratory`
Registers a diagnostic laboratory account with NABL details requiring admin review.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "lab@citydiagnostics.com",
  "password": "SecurePassword123!",
  "name": "City Diagnostic Centre",
  "phone": "+91 92222 33333",
  "address": "12 Healthcare Avenue, Mumbai",
  "city": "Mumbai",
  "nablAccreditationNumber": "NABL-MUM-2024-88",
  "providesHomeCollection": true,
  "homeCollectionFee": 150.00
}
```
- **Response `201 Created`:** Verification status starts at `pending`.

#### `POST /api/v1/auth/login`
Authenticates user credentials and issues an active JWT token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "patient@sushrut.com",
  "password": "Password123!"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "patient@sushrut.com",
    "role": "patient",
    "patientId": "PAI100001",
    "fullName": "Aarav Sharma"
  }
}
```

#### `GET /api/v1/auth/me`
Retrieves the logged-in user profile, role, and domain identifier.
- **Auth Required:** Yes (any authenticated role)
- **Response `200 OK`:** User object with active profile information.

#### `POST /api/v1/auth/forgot-password`
Generates a secure password reset token and delivery simulation.
- **Auth Required:** No
- **Request Body:** `{ "email": "user@example.com" }`

#### `POST /api/v1/auth/reset-password`
Resets user password with valid verification token.
- **Auth Required:** No
- **Request Body:** `{ "token": "reset-token", "password": "NewPassword123!" }`

---

### 3.3 Public Discovery Directory (`/api/v1/directory`)

#### `GET /api/v1/directory/specialties`
Returns all active medical specialties.
- **Auth Required:** No

#### `GET /api/v1/directory/doctors`
Returns approved doctors with filtering and sorting.
- **Query Parameters:**
  - `specialty`: Specialty UUID or name
  - `city`: City name
  - `search`: Keyword for doctor name or clinic
  - `minRating`: Minimum rating (1-10)
  - `maxFee`: Maximum consultation fee
  - `sortBy`: `rating` | `fee_asc` | `fee_desc` | `experience`

#### `GET /api/v1/directory/doctors/:doctorId`
Returns public profile details, qualifications, clinic location, and reviews for a doctor.
- **Auth Required:** No

#### `GET /api/v1/directory/doctors/:doctorId/slots`
Returns calculated 15-minute consultation slots for a specific calendar date.
- **Query Parameters:** `date` (YYYY-MM-DD, e.g. `2026-10-30`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "date": "2026-10-30",
  "slotDurationMinutes": 15,
  "slots": [
    { "time": "09:00", "isAvailable": true },
    { "time": "09:15", "isAvailable": false, "reason": "Booked" },
    { "time": "09:30", "isAvailable": true }
  ]
}
```

#### `GET /api/v1/directory/laboratories`
Returns approved diagnostic laboratories with home pickup filters.
- **Query Parameters:** `city`, `homeCollection` (`true`/`false`), `search`

#### `GET /api/v1/directory/laboratories/:laboratoryId`
Returns lab profile and available test catalog with custom prices.

#### `GET /api/v1/directory/tests`
Returns master diagnostic tests catalogue with sample types and turnaround times.

---

### 3.4 Patient Portal (`/api/v1/patients`)
*All endpoints require authentication and `role === 'patient'`.*

#### `GET /api/v1/patients/dashboard`
Returns summarized patient dashboard: upcoming appointments, recent records, active consent grants, vitals, and unread notifications count.

#### `GET /api/v1/patients/profile`
Retrieves full patient demographics, medical history, emergency contacts.

#### `PUT /api/v1/patients/profile`
Updates patient contact info, emergency contacts, allergies, and conditions.

#### `GET /api/v1/patients/appointments`
Returns list of all appointments for this patient with status filters (`upcoming`, `completed`, `cancelled`).

#### `POST /api/v1/patients/appointments/book`
Books a 15-minute slot with double-booking prevention.
- **Request Body:**
```json
{
  "doctorId": "DOC100001",
  "appointmentDate": "2026-10-30",
  "startTime": "09:30",
  "consultationType": "in_person",
  "symptoms": "Follow-up consultation for HbA1c review."
}
```
- **Responses:**
  - `201 Created`: Appointment booked with generated `APT` identifier.
  - `409 Conflict`: Slot has already been booked by another patient.

#### `POST /api/v1/patients/appointments/:appointmentId/cancel`
Cancels an upcoming appointment.
- **Request Body:** `{ "reason": "Patient requested reschedule" }`

#### `GET /api/v1/patients/medical-records`
Returns aggregated patient clinical history including diagnoses, prescriptions, and lab reports.

#### `GET /api/v1/patients/prescriptions`
Returns digital prescriptions with direct download links.

#### `GET /api/v1/patients/laboratory-reports`
Returns diagnostic laboratory reports with test results and statuses.

#### `GET /api/v1/patients/consent`
Returns active medical record access requests and historical consent grants.

#### `POST /api/v1/patients/consent/respond`
Approves or rejects a doctor's record access request.
- **Request Body:**
```json
{
  "requestId": "REQ-001",
  "approved": true,
  "scope": "all_records",
  "expiresInDays": 7
}
```

#### `POST /api/v1/patients/consent/revoke`
Immediately revokes an active doctor access grant.
- **Request Body:** `{ "grantId": "GRANT-001", "reason": "Consultation completed" }`

---

### 3.5 Doctor Portal (`/api/v1/doctors`)
*All endpoints require authentication and `role === 'doctor'`.*

#### `GET /api/v1/doctors/dashboard`
Returns doctor's appointment queue, today's schedule, pending record access requests, and average review score.

#### `GET /api/v1/doctors/appointments/today`
Returns daily consultation schedule with patient names, times, symptoms, and medical record consent status.

#### `GET /api/v1/doctors/appointments`
Returns full appointment history and calendar events.

#### `GET /api/v1/doctors/availability`
Returns current weekly recurring availability rules and slot durations.

#### `PUT /api/v1/doctors/availability`
Updates weekly consultation schedule (days of week, start/end hours, slot duration).
- **Request Body:**
```json
{
  "slotDurationMinutes": 15,
  "weeklyRules": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "isActive": true },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "isActive": true },
    { "dayOfWeek": 3, "startTime": "09:00", "endTime": "13:00", "isActive": true }
  ]
}
```

#### `GET /api/v1/doctors/access-requests`
Returns all record access requests sent by this doctor and their approval status.

#### `POST /api/v1/doctors/access-requests`
Submits an explicit record access request to a patient.
- **Request Body:**
```json
{
  "patientId": "PAI100001",
  "appointmentId": "APT1001",
  "purpose": "Evaluation of previous medical history and diagnostic reports",
  "requestedScope": "all_records"
}
```

#### `GET /api/v1/doctors/patients/:patientId/medical-records`
Accesses a patient's historical records.
- **Gatekeeper Enforced:** Evaluates `patient_access_grants`. If no active grant exists, returns `403 Forbidden` (`CONSENT_REQUIRED`).

#### `POST /api/v1/doctors/prescriptions`
Uploads a new prescription PDF with clinical diagnosis and medication items.
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `patientId`: "PAI100001"
  - `appointmentId`: "APT1001"
  - `diseaseId`: "DIS000001"
  - `diagnosisText`: "Type 2 Diabetes Mellitus"
  - `medications`: JSON string of medications `[{"name": "Metformin", "dosage": "500mg", "timing": "Twice daily"}]`
  - `dosageInstructions`: "Take with meals"
  - `followUpDate`: "2026-11-30"
  - `prescriptionPdf`: PDF file binary
- **Enforced Filename Rule:** Backend generates `PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf`.

---

### 3.6 Laboratory Portal (`/api/v1/laboratories`)
*All endpoints require authentication and `role === 'laboratory'`.*

#### `GET /api/v1/laboratories/dashboard`
Returns daily incoming test bookings, sample collection queue, pending report uploads, and turnaround statistics.

#### `GET /api/v1/laboratories/services`
Returns laboratory's test catalog, active offerings, and custom prices.

#### `POST /api/v1/laboratories/services`
Adds or updates a test offering.
- **Request Body:**
```json
{
  "testId": "TST000001",
  "price": 650.00,
  "isAvailable": true,
  "homeCollectionAvailable": true
}
```

#### `GET /api/v1/laboratories/bookings`
Returns lab orders with status filtering (`confirmed`, `sample_collected`, `processing`, `completed`).

#### `PATCH /api/v1/laboratories/bookings/:bookingId/status`
Updates sample collection and processing state.
- **Request Body:** `{ "status": "sample_collected" }`

#### `POST /api/v1/laboratories/reports/upload`
Uploads a certified test report PDF.
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `bookingId`: "LBD5001"
  - `patientId`: "PAI100001"
  - `testId`: "TST000001"
  - `reportTitle`: "HbA1c Glycated Hemoglobin Report"
  - `status`: "Normal" | "Abnormal" | "Critical"
  - `testResults`: JSON string with key-value biomarkers
  - `reportPdf`: PDF file binary
- **Enforced Filename Rule:** Backend generates `PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf`.

---

### 3.7 Administrator Portal (`/api/v1/admin`)
*All endpoints require authentication and `role === 'admin'`.*

#### `GET /api/v1/admin/dashboard`
Returns total patient count, verified/pending doctors, verified/pending labs, active appointments, and platform metrics.

#### `GET /api/v1/admin/doctors/pending`
Returns doctors awaiting credential verification.

#### `GET /api/v1/admin/doctors/:doctorId/verification`
Returns doctor's medical council registration, qualification certificates, and uploaded credential documents.

#### `POST /api/v1/admin/doctors/:doctorId/review`
Approves or rejects doctor credentials.
- **Request Body:**
```json
{
  "decision": "approved", // or "rejected"
  "notes": "Verified against National Medical Commission registry."
}
```

#### `GET /api/v1/admin/laboratories/pending`
Returns diagnostic centres awaiting NABL verification.

#### `POST /api/v1/admin/laboratories/:labId/review`
Approves or rejects laboratory accreditation.
- **Request Body:** `{ "decision": "approved", "notes": "NABL certificate active." }`

#### `GET /api/v1/admin/patients`
Retrieves all registered patients for administrative management.

#### `GET /api/v1/admin/doctors`
Retrieves all registered doctors with active status toggles.

#### `GET /api/v1/admin/laboratories`
Retrieves all registered diagnostic laboratories.

#### `GET /api/v1/admin/audit-logs`
Returns platform audit logs with actor, IP address, action, and timestamp.
- **Strict Privacy Rule:** Administrators can view access audit logs, but **cannot view or download private clinical PDFs**.

---

### 3.8 Secure Document Delivery (`/api/v1/documents`)

#### `GET /api/v1/documents/:documentId`
Streams private medical PDF binary with security checks.
- **Auth Required:** Yes
- **Access Control Enforced:**
  - Patient can access their own documents.
  - Doctor can access only with an active `patient_access_grants` record.
  - Laboratory can access only reports issued by their own lab.
  - Admin access is rejected (`403 Forbidden`).
- **Response `200 OK`:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="PAI100001-DIS000001-DOC100001-RPT000001.pdf"`

#### `GET /api/v1/documents/:documentId/metadata`
Returns document verification metadata, SHA-256 hash, and file size.

---

### 3.9 Reviews & Ratings (`/api/v1/reviews`)

#### `GET /api/v1/reviews/doctors/:doctorId`
Returns published reviews and average rating for a doctor.
- **Auth Required:** No

#### `POST /api/v1/reviews/submit`
Submits a rating (1-10) and consultation review.
- **Auth Required:** Yes (`patient` only)
- **Constraint:** Must be linked to a completed appointment.

---

### 3.10 In-App Notifications (`/api/v1/notifications`)

#### `GET /api/v1/notifications`
Returns current user's chronological notification stream.
- **Auth Required:** Yes

#### `PATCH /api/v1/notifications/:id/read`
Marks an individual notification as read.
- **Auth Required:** Yes
