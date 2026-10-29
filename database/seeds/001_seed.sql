-- =====================================================================
-- SUSHRUT HEALTHCARE MANAGEMENT PLATFORM - SEED DATA
-- =====================================================================
-- Execute this script AFTER executing database/supabase-schema.sql
-- All demo user passwords are: Password@123
-- =====================================================================

-- 1. SEED MEDICAL SPECIALTIES
INSERT INTO specialties (id, name, slug, description, icon, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'General Physician', 'general-physician', 'Primary healthcare, preventive medicine, fevers, and common ailments', 'Stethoscope', true),
('a0000000-0000-0000-0000-000000000002', 'Diabetes Specialist', 'diabetes-specialist', 'Type 1 & Type 2 diabetes, metabolic disorders, and thyroid care', 'Activity', true),
('a0000000-0000-0000-0000-000000000003', 'Cardiologist', 'cardiologist', 'Heart health, hypertension, ECG, echocardiography, and vascular disease', 'Heart', true),
('a0000000-0000-0000-0000-000000000004', 'Dermatologist', 'dermatologist', 'Skin, hair, nails, allergies, acne, and cosmetic dermatology', 'Sparkles', true),
('a0000000-0000-0000-0000-000000000005', 'Orthopedic Specialist', 'orthopedic-specialist', 'Bone fractures, joint pain, arthritis, spine care, and sports injuries', 'Bone', true),
('a0000000-0000-0000-0000-000000000006', 'Pediatrician', 'pediatrician', 'Newborn care, child growth monitoring, vaccinations, and pediatric illnesses', 'Baby', true),
('a0000000-0000-0000-0000-000000000007', 'Gynecologist', 'gynecologist', 'Women''s reproductive health, prenatal care, PCOS, and maternity', 'UserCheck', true),
('a0000000-0000-0000-0000-000000000008', 'Neurologist', 'neurologist', 'Brain disorders, stroke recovery, migraine, epilepsy, and neuropathy', 'Brain', true),
('a0000000-0000-0000-0000-000000000009', 'Psychiatrist', 'psychiatrist', 'Mental health, depression, anxiety management, counseling, and cognitive care', 'Smile', true),
('a0000000-0000-0000-0000-000000000010', 'ENT Specialist', 'ent-specialist', 'Ear, nose, throat, sinusitis, hearing loss, and tonsillitis care', 'Ear', true),
('a0000000-0000-0000-0000-000000000011', 'Ophthalmologist', 'ophthalmologist', 'Eye examinations, cataract care, glaucoma, and vision corrections', 'Eye', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED TEST CATALOGUE
INSERT INTO test_catalogue (id, test_id, name, category, sample_type, fasting_required, preparation_instructions, default_price, turnaround_time_hours, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', 'TST000001', 'Complete Blood Count (CBC)', 'Hematology', 'Whole Blood (EDTA)', false, 'No specific fasting required. Maintain normal hydration.', 350.00, 12, true),
('b0000000-0000-0000-0000-000000000002', 'TST000002', 'HbA1c (Glycated Hemoglobin)', 'Diabetology & Biochemistry', 'Whole Blood (EDTA)', false, 'Non-fasting test. Provides an average of 3-month blood glucose control.', 500.00, 12, true),
('b0000000-0000-0000-0000-000000000003', 'TST000003', 'Comprehensive Lipid Profile', 'Biochemistry', 'Blood Serum', true, 'Overnight fasting of 10-12 hours required. Water is permitted.', 650.00, 24, true),
('b0000000-0000-0000-0000-000000000004', 'TST000004', 'Thyroid Profile Total (T3, T4, TSH)', 'Endocrinology', 'Blood Serum', true, 'Morning fasting sample preferred. Do not take thyroid medication before the test.', 550.00, 24, true),
('b0000000-0000-0000-0000-000000000005', 'TST000005', 'Liver Function Test (LFT)', 'Biochemistry', 'Blood Serum', true, '8-10 hours fasting recommended. Avoid alcohol for 24 hours.', 750.00, 24, true),
('b0000000-0000-0000-0000-000000000006', 'TST000006', 'Renal / Kidney Function Test (KFT)', 'Biochemistry', 'Blood Serum', false, 'Ensure normal hydration. Avoid heavy red meat consumption before test.', 700.00, 24, true),
('b0000000-0000-0000-0000-000000000007', 'TST000007', 'Vitamin D3 (25-Hydroxy)', 'Vitamins & Nutrients', 'Blood Serum', false, 'No fasting needed.', 1100.00, 36, true)
ON CONFLICT (test_id) DO NOTHING;

-- 3. SEED DISEASES CATALOGUE
INSERT INTO diseases_catalogue (id, disease_id, code, name, description, category) VALUES
('c0000000-0000-0000-0000-000000000001', 'DIS000001', 'E11.9', 'Type 2 Diabetes Mellitus', 'Non-insulin-dependent diabetes mellitus without complications', 'Endocrine & Metabolic'),
('c0000000-0000-0000-0000-000000000002', 'DIS000002', 'I10', 'Essential (Primary) Hypertension', 'High systemic blood pressure without clear secondary etiology', 'Cardiovascular'),
('c0000000-0000-0000-0000-000000000003', 'DIS000003', 'E03.9', 'Hypothyroidism, Unspecified', 'Underactive thyroid gland with reduced T3/T4 hormone production', 'Endocrine & Metabolic')
ON CONFLICT (disease_id) DO NOTHING;

-- 4. SEED DEMO USERS (Password for all: Password@123)
-- Hash: $2a$10$BiutZHcE/7pgikMGgO5K1.qVqyBOZaiTu/bFiJgG2Vj2cDf8azT5u
INSERT INTO users (id, email, password_hash, role, is_active, email_verified) VALUES
('u0000000-0000-0000-0000-000000000001', 'patient@sushrut.com', '$2a$10$BiutZHcE/7pgikMGgO5K1.qVqyBOZaiTu/bFiJgG2Vj2cDf8azT5u', 'patient', true, true),
('u0000000-0000-0000-0000-000000000002', 'doctor@sushrut.com', '$2a$10$BiutZHcE/7pgikMGgO5K1.qVqyBOZaiTu/bFiJgG2Vj2cDf8azT5u', 'doctor', true, true),
('u0000000-0000-0000-0000-000000000003', 'lab@sushrut.com', '$2a$10$BiutZHcE/7pgikMGgO5K1.qVqyBOZaiTu/bFiJgG2Vj2cDf8azT5u', 'laboratory', true, true),
('u0000000-0000-0000-0000-000000000004', 'admin@sushrut.com', '$2a$10$BiutZHcE/7pgikMGgO5K1.qVqyBOZaiTu/bFiJgG2Vj2cDf8azT5u', 'admin', true, true)
ON CONFLICT (email) DO NOTHING;

-- 5. SEED PATIENT PROFILE
INSERT INTO patients (id, patient_id, user_id, full_name, phone, dob, gender, blood_group, city, state, postal_code, allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone) VALUES
('p0000000-0000-0000-0000-000000000001', 'PAI100001', 'u0000000-0000-0000-0000-000000000001', 'Aarav Sharma', '+91 98765 43210', '1988-05-14', 'Male', 'B+', 'Mumbai', 'Maharashtra', '400001', 'Penicillin, Dust mites', 'Type 2 Diabetes (HbA1c 6.8%), Mild Hypertension', 'Pooja Sharma', '+91 98765 43211')
ON CONFLICT (patient_id) DO NOTHING;

-- 6. SEED DOCTOR PROFILE
INSERT INTO doctors (id, doctor_id, user_id, full_name, phone, primary_specialty_id, qualifications, registration_number, experience_years, consultation_fee, clinic_name, clinic_address, city, latitude, longitude, bio, verification_status, rating_avg, total_reviews) VALUES
('d0000000-0000-0000-0000-000000000001', 'DOC100001', 'u0000000-0000-0000-0000-000000000002', 'Dr. Rajesh Mehta', '+91 98200 11223', 'a0000000-0000-0000-0000-000000000002', 'MBBS, MD (Medicine), DM (Endocrinology)', 'MCI-1998-4421', 18, 800.00, 'Apex Diabetes & Hormone Care', '102 Doctor Plaza, Linking Road, Bandra West', 'Mumbai', 19.0596, 72.8295, 'Senior Diabetologist & Endocrinologist with 18+ years of clinical excellence in complex metabolic health.', 'approved', 9.6, 214)
ON CONFLICT (doctor_id) DO NOTHING;

-- Doctor Availability Rules (Monday - Friday: 09:00 - 17:00, 15-minute slots)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_active) VALUES
('d0000000-0000-0000-0000-000000000001', 1, '09:00:00', '17:00:00', 15, true),
('d0000000-0000-0000-0000-000000000001', 2, '09:00:00', '17:00:00', 15, true),
('d0000000-0000-0000-0000-000000000001', 3, '09:00:00', '17:00:00', 15, true),
('d0000000-0000-0000-0000-000000000001', 4, '09:00:00', '17:00:00', 15, true),
('d0000000-0000-0000-0000-000000000001', 5, '09:00:00', '17:00:00', 15, true);

-- 7. SEED LABORATORY PROFILE
INSERT INTO laboratories (id, lab_id, user_id, name, phone, email, address, city, state, postal_code, latitude, longitude, nabl_accreditation_number, verification_status, provides_home_collection, home_collection_fee, operating_hours) VALUES
('l0000000-0000-0000-0000-000000000001', 'LAB100001', 'u0000000-0000-0000-0000-000000000003', 'Apex Diagnostic & Pathology Centre', '+91 22 2640 5566', 'contact@apexdiagnostics.com', 'Ground Floor, Metro Tower, Andheri East', 'Mumbai', 'Maharashtra', '400069', 19.1136, 72.8697, 'NABL-MC-2023-9821', 'approved', true, 150.00, '7:00 AM - 9:00 PM')
ON CONFLICT (lab_id) DO NOTHING;

-- Laboratory Offerings
INSERT INTO laboratory_offerings (lab_id, test_id, price, is_available, home_collection_available) VALUES
('l0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 320.00, true, true),
('l0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 480.00, true, true),
('l0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 600.00, true, true)
ON CONFLICT (lab_id, test_id) DO NOTHING;

-- 8. SEED SAMPLE APPOINTMENT
INSERT INTO appointments (id, appointment_id, patient_id, doctor_id, appointment_date, start_time, end_time, status, consultation_type, fee, symptoms) VALUES
('ap000000-0000-0000-0000-000000000001', 'APT1001', 'p0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '10:00:00', '10:15:00', 'confirmed', 'in_person', 800.00, 'Quarterly HbA1c routine evaluation and medication dosage adjustments')
ON CONFLICT (appointment_id) DO NOTHING;
