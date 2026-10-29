-- =====================================================================
-- SUSHRUT HEALTHCARE MANAGEMENT PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- =====================================================================
-- This file defines the complete tabular relational schema for the platform.
-- File storage for medical PDFs is separated from this database.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. IDENTIFIER SEQUENCES
-- ---------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS seq_patient_id START WITH 100001;
CREATE SEQUENCE IF NOT EXISTS seq_doctor_id START WITH 100001;
CREATE SEQUENCE IF NOT EXISTS seq_laboratory_id START WITH 100001;
CREATE SEQUENCE IF NOT EXISTS seq_test_id START WITH 1;
CREATE SEQUENCE IF NOT EXISTS seq_disease_id START WITH 1;
CREATE SEQUENCE IF NOT EXISTS seq_report_id START WITH 1;
CREATE SEQUENCE IF NOT EXISTS seq_appointment_id START WITH 1001;
CREATE SEQUENCE IF NOT EXISTS seq_lab_booking_id START WITH 5001;

-- ---------------------------------------------------------------------
-- 2. ACCOUNTS & USERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'laboratory', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT true,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Refresh tokens for secure session revocation
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. MEDICAL SPECIALTIES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 4. PATIENT PROFILES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(30) NOT NULL UNIQUE, -- Format: PAI100001
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    dob DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    blood_group VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- ---------------------------------------------------------------------
-- 5. DOCTOR PROFILES & AVAILABILITY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id VARCHAR(30) NOT NULL UNIQUE, -- Format: DOC100001
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    primary_specialty_id UUID REFERENCES specialties(id),
    qualifications VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 500.00,
    clinic_name VARCHAR(200) NOT NULL,
    clinic_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    bio TEXT,
    profile_image_url TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_notes TEXT,
    verification_documents JSONB DEFAULT '[]'::jsonb,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    rating_avg NUMERIC(3, 1) NOT NULL DEFAULT 9.5,
    total_reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_doctor_id ON doctors(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(primary_specialty_id);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(verification_status);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(city);

CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialty_id)
);

-- Doctor Weekly Availability Rules
CREATE TABLE IF NOT EXISTS doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 15 CHECK (slot_duration_minutes IN (10, 15, 20, 30, 45, 60)),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_doctor_avail_time CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_doc_avail_doctor ON doctor_availability(doctor_id);

-- Availability Exceptions (Holidays, Leaves, Extra Sessions)
CREATE TABLE IF NOT EXISTS doctor_availability_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_unavailable BOOLEAN NOT NULL DEFAULT true,
    reason VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 6. LABORATORY PROFILES & TEST CATALOGUE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS laboratories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id VARCHAR(30) NOT NULL UNIQUE, -- Format: LAB100001
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    nabl_accreditation_number VARCHAR(100),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_notes TEXT,
    verification_documents JSONB DEFAULT '[]'::jsonb,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    provides_home_collection BOOLEAN NOT NULL DEFAULT true,
    home_collection_fee NUMERIC(10,2) NOT NULL DEFAULT 150.00,
    operating_hours VARCHAR(150) DEFAULT '8:00 AM - 8:00 PM',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_laboratories_lab_id ON laboratories(lab_id);
CREATE INDEX IF NOT EXISTS idx_laboratories_status ON laboratories(verification_status);

-- Standardized Test Catalogue
CREATE TABLE IF NOT EXISTS test_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id VARCHAR(30) NOT NULL UNIQUE, -- Format: TST000001
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    sample_type VARCHAR(100) NOT NULL,
    fasting_required BOOLEAN NOT NULL DEFAULT false,
    preparation_instructions TEXT,
    default_price NUMERIC(10,2) NOT NULL DEFAULT 500.00,
    turnaround_time_hours INT NOT NULL DEFAULT 24,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_catalogue_test_id ON test_catalogue(test_id);
CREATE INDEX IF NOT EXISTS idx_test_catalogue_category ON test_catalogue(category);

-- Laboratory Specific Offerings & Custom Pricing
CREATE TABLE IF NOT EXISTS laboratory_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES test_catalogue(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    home_collection_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lab_id, test_id)
);

-- ---------------------------------------------------------------------
-- 7. APPOINTMENTS & CONCURRENCY CONSTRAINTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id VARCHAR(30) NOT NULL UNIQUE, -- Format: APT1001
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    consultation_type VARCHAR(30) NOT NULL DEFAULT 'in_person' CHECK (consultation_type IN ('in_person', 'video')),
    fee NUMERIC(10,2) NOT NULL,
    symptoms TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent double-booking race conditions for active bookings:
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking 
ON appointments(doctor_id, appointment_date, start_time) 
WHERE status NOT IN ('cancelled');

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- ---------------------------------------------------------------------
-- 8. LABORATORY BOOKINGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS laboratory_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(30) NOT NULL UNIQUE, -- Format: LBD5001
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES test_catalogue(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    preferred_time_slot VARCHAR(50) NOT NULL,
    collection_type VARCHAR(30) NOT NULL DEFAULT 'lab_visit' CHECK (collection_type IN ('lab_visit', 'home_collection')),
    collection_address TEXT,
    collection_city VARCHAR(100),
    collection_postal_code VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled')),
    total_amount NUMERIC(10,2) NOT NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_bookings_patient ON laboratory_bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_bookings_lab ON laboratory_bookings(lab_id);

-- ---------------------------------------------------------------------
-- 9. DISEASES & CLINICAL DIAGNOSES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diseases_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id VARCHAR(30) NOT NULL UNIQUE, -- Format: DIS000001
    code VARCHAR(50), -- ICD-10 or internal code
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diseases_disease_id ON diseases_catalogue(disease_id);

CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnosis_id VARCHAR(30) NOT NULL UNIQUE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    disease_id UUID REFERENCES diseases_catalogue(id) ON DELETE SET NULL,
    diagnosis_text TEXT NOT NULL,
    clinical_notes TEXT,
    diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 10. PRESCRIPTIONS & FILENAMES
-- Filename Pattern: PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
-- Example: PAI100001-DIS000001-DOC100001-RPT000001.pdf
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id VARCHAR(30) NOT NULL UNIQUE,
    record_id VARCHAR(30) NOT NULL, -- Format: RPT000001
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    disease_id UUID REFERENCES diseases_catalogue(id) ON DELETE SET NULL,
    diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE SET NULL,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    dosage_instructions TEXT,
    dietary_advice TEXT,
    follow_up_date DATE,
    pdf_filename VARCHAR(255) NOT NULL,
    pdf_storage_path VARCHAR(500) NOT NULL,
    file_size_bytes INT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    checksum_sha256 VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- ---------------------------------------------------------------------
-- 11. LABORATORY REPORTS & FILENAMES
-- Filename Pattern: PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
-- Example: PAI100001-TST000001-LAB100001-RPT000001.pdf
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS laboratory_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(30) NOT NULL UNIQUE, -- Format: RPT000001
    lab_booking_id UUID REFERENCES laboratory_bookings(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES test_catalogue(id) ON DELETE CASCADE,
    report_title VARCHAR(255) NOT NULL,
    description TEXT,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    test_results JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'Normal' CHECK (status IN ('Normal', 'Abnormal', 'Critical', 'Pending Review')),
    pdf_filename VARCHAR(255) NOT NULL,
    pdf_storage_path VARCHAR(500) NOT NULL,
    file_size_bytes INT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    checksum_sha256 VARCHAR(64),
    is_corrected BOOLEAN NOT NULL DEFAULT false,
    correction_reason TEXT,
    corrected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_reports_patient ON laboratory_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_lab ON laboratory_reports(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_test ON laboratory_reports(test_id);

-- ---------------------------------------------------------------------
-- 12. PATIENT CONSENT & PERMISSION GATEKEEPER
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(30) NOT NULL UNIQUE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL,
    requested_scope VARCHAR(50) NOT NULL DEFAULT 'all_records' CHECK (requested_scope IN ('all_records', 'prescriptions_only', 'lab_reports_only', 'single_appointment')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_req_patient ON patient_access_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_req_doctor ON patient_access_requests(doctor_id);

CREATE TABLE IF NOT EXISTS patient_access_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grant_id VARCHAR(30) NOT NULL UNIQUE,
    request_id UUID REFERENCES patient_access_requests(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    scope VARCHAR(50) NOT NULL DEFAULT 'all_records' CHECK (scope IN ('all_records', 'prescriptions_only', 'lab_reports_only', 'single_appointment')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_grants_lookup ON patient_access_grants(doctor_id, patient_id, status);

-- Audit log specifically for sensitive record access events
CREATE TABLE IF NOT EXISTS patient_access_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    accessed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accessor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'request_sent', 'granted', 'revoked', 'record_viewed', 'pdf_downloaded'
    resource_type VARCHAR(100) NOT NULL, -- 'medical_records', 'prescription', 'lab_report'
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    outcome VARCHAR(30) NOT NULL DEFAULT 'allowed' CHECK (outcome IN ('allowed', 'denied')),
    denial_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 13. REVIEWS & RATINGS (1-10 Scale)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE UNIQUE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    review_text TEXT,
    is_moderated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_doctor ON doctor_reviews(doctor_id);

-- ---------------------------------------------------------------------
-- 14. IN-APP NOTIFICATIONS & PLATFORM AUDIT
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'appointment', 'consent', 'report', 'verification')),
    link_url VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
