import pg from 'pg';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Load seed data reference
const seedDataPath = path.resolve(__dirname, '../../../database/seeds/seed-data.json');
let initialSeed = { specialties: [], tests: [], diseases: [] };
if (fs.existsSync(seedDataPath)) {
  try {
    initialSeed = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse seed-data.json', e);
  }
}

// In-Memory Relational State initialized with rich data
class InMemoryDB {
  constructor() {
    this.users = [];
    this.patients = [];
    this.doctors = [];
    this.laboratories = [];
    this.specialties = [];
    this.doctorSpecialties = [];
    this.doctorAvailability = [];
    this.doctorAvailabilityExceptions = [];
    this.tests = [];
    this.laboratoryOfferings = [];
    this.diseases = [];
    this.appointments = [];
    this.laboratoryBookings = [];
    this.diagnoses = [];
    this.prescriptions = [];
    this.laboratoryReports = [];
    this.patientAccessRequests = [];
    this.patientAccessGrants = [];
    this.patientAccessAuditLogs = [];
    this.doctorReviews = [];
    this.notifications = [];
    this.auditLogs = [];
    this.initDefaultData();
  }

  initDefaultData() {
    const passwordHash = bcrypt.hashSync('Password@123', 10);

    // 1. Admin User
    this.users.push({
      id: 'usr-admin-01',
      email: 'admin@sushrut.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    });

    // 2. Patient User & Profile
    this.users.push({
      id: 'usr-patient-01',
      email: 'patient@sushrut.com',
      password_hash: passwordHash,
      role: 'patient',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    });
    this.patients.push({
      id: 'pat-001',
      patient_id: 'PAI100001',
      user_id: 'usr-patient-01',
      full_name: 'Aarav Patel',
      phone: '+91 98765 43210',
      dob: '1992-05-14',
      gender: 'Male',
      blood_group: 'B+',
      address: '402, Lotus Greens, Sector 45',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400053',
      emergency_contact_name: 'Sunita Patel',
      emergency_contact_phone: '+91 98765 43211',
      allergies: 'Penicillin, Shellfish',
      chronic_conditions: 'Type 2 Diabetes Mellitus',
      created_at: new Date().toISOString()
    });

    // Additional patient
    this.users.push({
      id: 'usr-patient-02',
      email: 'priya.sharma@example.com',
      password_hash: passwordHash,
      role: 'patient',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString()
    });
    this.patients.push({
      id: 'pat-002',
      patient_id: 'PAI100002',
      user_id: 'usr-patient-02',
      full_name: 'Priya Sharma',
      phone: '+91 98222 11334',
      dob: '1996-08-22',
      gender: 'Female',
      blood_group: 'O+',
      address: '12, Sea Breeze Apts, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400018',
      created_at: new Date().toISOString()
    });

    // 3. Specialties
    this.specialties = (initialSeed.specialties || []).map(s => ({
      ...s,
      is_active: true,
      created_at: new Date().toISOString()
    }));

    // 4. Doctors
    const doctorSeeds = [
      {
        userId: 'usr-doc-01',
        id: 'doc-001',
        doctor_id: 'DOC100001',
        email: 'doctor@sushrut.com',
        full_name: 'Dr. Ananya Sharma',
        specialtySlug: 'cardiologist',
        qualifications: 'MBBS, MD, DM (Cardiology)',
        registration_number: 'MCI-2012-88231',
        experience_years: 12,
        consultation_fee: 800.00,
        clinic_name: 'Apex Heart & Vascular Centre',
        clinic_address: 'Bandra West, Mumbai',
        city: 'Mumbai',
        latitude: 19.0596,
        longitude: 72.8295,
        rating_avg: 9.6,
        total_reviews: 142,
        verification_status: 'approved',
        bio: 'Dr. Ananya Sharma is a senior consultant cardiologist with extensive expertise in preventative cardiology, hypertension management, and non-invasive cardiac imaging.'
      },
      {
        userId: 'usr-doc-02',
        id: 'doc-002',
        doctor_id: 'DOC100002',
        email: 'rajesh.iyer@sushrut.com',
        full_name: 'Dr. Rajesh Iyer',
        specialtySlug: 'general-physician',
        qualifications: 'MBBS, MD (Internal Medicine)',
        registration_number: 'MCI-2009-44120',
        experience_years: 15,
        consultation_fee: 500.00,
        clinic_name: 'LifeCare Family Clinic',
        clinic_address: 'Andheri East, Mumbai',
        city: 'Mumbai',
        latitude: 19.1136,
        longitude: 72.8697,
        rating_avg: 9.4,
        total_reviews: 218,
        verification_status: 'approved',
        bio: 'Dr. Rajesh Iyer specializes in primary care, chronic condition management including diabetes and hypertension, and seasonal infections.'
      },
      {
        userId: 'usr-doc-03',
        id: 'doc-003',
        doctor_id: 'DOC100003',
        email: 'priya.nair@sushrut.com',
        full_name: 'Dr. Priya Nair',
        specialtySlug: 'dermatologist',
        qualifications: 'MBBS, DVD, MD (Dermatology)',
        registration_number: 'MCI-2015-99341',
        experience_years: 9,
        consultation_fee: 700.00,
        clinic_name: 'Glow Skin & Hair Clinic',
        clinic_address: 'Juhu, Mumbai',
        city: 'Mumbai',
        latitude: 19.1075,
        longitude: 72.8263,
        rating_avg: 9.8,
        total_reviews: 184,
        verification_status: 'approved',
        bio: 'Expert in clinical dermatology, acne treatments, eczema, hair loss therapies, and cosmetic dermatology procedures.'
      },
      {
        userId: 'usr-doc-04',
        id: 'doc-004',
        doctor_id: 'DOC100004',
        email: 'vikram.sethi@sushrut.com',
        full_name: 'Dr. Vikram Sethi',
        specialtySlug: 'orthopedic-specialist',
        qualifications: 'MBBS, MS (Orthopedics), M.Ch',
        registration_number: 'MCI-2006-12890',
        experience_years: 18,
        consultation_fee: 900.00,
        clinic_name: 'Sethi Bone & Joint Hospital',
        clinic_address: 'Dadar, Mumbai',
        city: 'Mumbai',
        latitude: 19.0178,
        longitude: 72.8478,
        rating_avg: 9.5,
        total_reviews: 165,
        verification_status: 'approved',
        bio: 'Specializes in joint replacement surgeries, sports trauma, arthroscopic knee surgeries, and degenerative spine disorders.'
      },
      {
        userId: 'usr-doc-05',
        id: 'doc-005',
        doctor_id: 'DOC100005',
        email: 'meera.nambiar@sushrut.com',
        full_name: 'Dr. Meera Nambiar',
        specialtySlug: 'pediatrician',
        qualifications: 'MBBS, DCH, DNB (Pediatrics)',
        registration_number: 'MCI-2013-66723',
        experience_years: 11,
        consultation_fee: 600.00,
        clinic_name: 'Little Stars Child Clinic',
        clinic_address: 'Powai, Mumbai',
        city: 'Mumbai',
        latitude: 19.1176,
        longitude: 72.9060,
        rating_avg: 9.7,
        total_reviews: 310,
        verification_status: 'approved',
        bio: 'Passionate child specialist offering comprehensive newborn care, vaccination, developmental assessments, and pediatric care.'
      },
      {
        userId: 'usr-doc-09',
        id: 'doc-009',
        doctor_id: 'DOC100009',
        email: 'kavita.verma@sushrut.com',
        full_name: 'Dr. Kavita Verma',
        specialtySlug: 'diabetes-specialist',
        qualifications: 'MBBS, C.Diab, MD',
        registration_number: 'MCI-2011-48291',
        experience_years: 13,
        consultation_fee: 650.00,
        clinic_name: 'EndoCare Metabolic Centre',
        clinic_address: 'Chembur, Mumbai',
        city: 'Mumbai',
        latitude: 19.0522,
        longitude: 72.8994,
        rating_avg: 9.5,
        total_reviews: 190,
        verification_status: 'pending', // Pending Admin approval verification
        bio: 'Expert endocrinologist and diabetologist specializing in Type 1 & 2 diabetes, gestational diabetes, and thyroid disorders.'
      }
    ];

    doctorSeeds.forEach(doc => {
      this.users.push({
        id: doc.userId,
        email: doc.email,
        password_hash: passwordHash,
        role: 'doctor',
        is_active: true,
        email_verified: true,
        created_at: new Date().toISOString()
      });

      const sp = this.specialties.find(s => s.slug === doc.specialtySlug);
      this.doctors.push({
        id: doc.id,
        doctor_id: doc.doctor_id,
        user_id: doc.userId,
        full_name: doc.full_name,
        phone: '+91 98111 22334',
        primary_specialty_id: sp ? sp.id : null,
        specialty_name: sp ? sp.name : 'General Healthcare',
        qualifications: doc.qualifications,
        registration_number: doc.registration_number,
        experience_years: doc.experience_years,
        consultation_fee: doc.consultation_fee,
        clinic_name: doc.clinic_name,
        clinic_address: doc.clinic_address,
        city: doc.city,
        latitude: doc.latitude,
        longitude: doc.longitude,
        bio: doc.bio,
        rating_avg: doc.rating_avg,
        total_reviews: doc.total_reviews,
        verification_status: doc.verification_status,
        verification_documents: [
          { name: 'Medical_Registration_Certificate.pdf', url: '/storage/sample_doc.pdf' },
          { name: 'Degree_Certificate_MBBS_MD.pdf', url: '/storage/sample_doc.pdf' }
        ],
        created_at: new Date().toISOString()
      });

      // Default weekly availability: Monday (1) to Friday (5)
      // 10:00 to 13:00 and 16:00 to 19:00
      for (let day = 1; day <= 5; day++) {
        this.doctorAvailability.push({
          id: `avail-${doc.id}-${day}-1`,
          doctor_id: doc.id,
          day_of_week: day,
          start_time: '10:00:00',
          end_time: '13:00:00',
          slot_duration_minutes: 15,
          is_active: true
        });
        this.doctorAvailability.push({
          id: `avail-${doc.id}-${day}-2`,
          doctor_id: doc.id,
          day_of_week: day,
          start_time: '16:00:00',
          end_time: '19:00:00',
          slot_duration_minutes: 15,
          is_active: true
        });
      }
    });

    // 5. Laboratories
    const labSeeds = [
      {
        userId: 'usr-lab-01',
        id: 'lab-001',
        lab_id: 'LAB100001',
        email: 'lab@sushrut.com',
        name: 'Metropolis Diagnostics Centre',
        phone: '+91 22 6677 8899',
        address: 'Tower A, Healthcare Hub, Lower Parel',
        city: 'Mumbai',
        latitude: 18.9950,
        longitude: 72.8250,
        nabl_number: 'NABL-MC-2021-9988',
        verification_status: 'approved',
        provides_home_collection: true,
        home_collection_fee: 150.00,
        operating_hours: '7:00 AM - 9:00 PM',
        description: 'NABL & CAP accredited clinical diagnostics laboratory equipped with fully automated multi-analyzer systems.'
      },
      {
        userId: 'usr-lab-02',
        id: 'lab-002',
        lab_id: 'LAB100002',
        email: 'srl@sushrut.com',
        name: 'SRL Diagnostics & Pathology',
        phone: '+91 22 4433 2211',
        address: 'Ground Floor, City Point, Andheri West',
        city: 'Mumbai',
        latitude: 19.1197,
        longitude: 72.8464,
        nabl_number: 'NABL-MC-2019-3322',
        verification_status: 'approved',
        provides_home_collection: true,
        home_collection_fee: 100.00,
        operating_hours: '8:00 AM - 8:00 PM',
        description: 'Comprehensive pathology, molecular diagnostics, and preventive health checks.'
      },
      {
        userId: 'usr-lab-03',
        id: 'lab-003',
        lab_id: 'LAB100003',
        email: 'apexlabs@sushrut.com',
        name: 'Apex Clinical & Genomics Lab',
        phone: '+91 22 5544 3322',
        address: 'Sector 17, Vashi, Navi Mumbai',
        city: 'Navi Mumbai',
        latitude: 19.0771,
        longitude: 72.9986,
        nabl_number: 'NABL-MC-2023-1144',
        verification_status: 'pending', // Pending Admin approval
        provides_home_collection: false,
        home_collection_fee: 0.00,
        operating_hours: '8:00 AM - 7:00 PM',
        description: 'Specialized biochemical and hormone assay services.'
      }
    ];

    labSeeds.forEach(lab => {
      this.users.push({
        id: lab.userId,
        email: lab.email,
        password_hash: passwordHash,
        role: 'laboratory',
        is_active: true,
        email_verified: true,
        created_at: new Date().toISOString()
      });

      this.laboratories.push({
        id: lab.id,
        lab_id: lab.lab_id,
        user_id: lab.userId,
        name: lab.name,
        phone: lab.phone,
        email: lab.email,
        address: lab.address,
        city: lab.city,
        state: 'Maharashtra',
        postal_code: '400013',
        latitude: lab.latitude,
        longitude: lab.longitude,
        nabl_accreditation_number: lab.nabl_number,
        verification_status: lab.verification_status,
        verification_documents: [
          { name: 'NABL_Accreditation_Certificate.pdf', url: '/storage/sample_doc.pdf' },
          { name: 'State_Pollution_Control_BioMedical_Permit.pdf', url: '/storage/sample_doc.pdf' }
        ],
        provides_home_collection: lab.provides_home_collection,
        home_collection_fee: lab.home_collection_fee,
        operating_hours: lab.operating_hours,
        description: lab.description,
        created_at: new Date().toISOString()
      });
    });

    // 6. Test Catalogue & Offerings
    this.tests = (initialSeed.tests || []).map(t => ({
      ...t,
      is_active: true,
      created_at: new Date().toISOString()
    }));

    // Connect tests to labs
    this.laboratories.forEach(lab => {
      this.tests.forEach((t, idx) => {
        const customPrice = t.default_price + (idx % 2 === 0 ? 0 : 50);
        this.laboratoryOfferings.push({
          id: `off-${lab.id}-${t.id}`,
          lab_id: lab.id,
          test_id: t.id,
          price: customPrice,
          is_available: true,
          home_collection_available: lab.provides_home_collection
        });
      });
    });

    // 7. Diseases Catalogue
    this.diseases = (initialSeed.diseases || []).map(d => ({
      ...d,
      created_at: new Date().toISOString()
    }));

    // 8. Appointments
    const pat = this.patients[0];
    const doc1 = this.doctors[0];
    const todayStr = new Date().toISOString().split('T')[0];

    this.appointments.push({
      id: 'apt-001',
      appointment_id: 'APT1001',
      patient_id: pat.id,
      patient_name: pat.full_name,
      doctor_id: doc1.id,
      doctor_name: doc1.full_name,
      specialty_name: doc1.specialty_name,
      clinic_name: doc1.clinic_name,
      clinic_address: doc1.clinic_address,
      appointment_date: todayStr,
      start_time: '16:30:00',
      end_time: '16:45:00',
      status: 'confirmed',
      consultation_type: 'in_person',
      fee: doc1.consultation_fee,
      symptoms: 'Follow-up for blood pressure check and chest tightness post exercise',
      created_at: new Date(Date.now() - 86400000).toISOString()
    });

    this.appointments.push({
      id: 'apt-002',
      appointment_id: 'APT1002',
      patient_id: pat.id,
      patient_name: pat.full_name,
      doctor_id: this.doctors[1].id,
      doctor_name: this.doctors[1].full_name,
      specialty_name: this.doctors[1].specialty_name,
      clinic_name: this.doctors[1].clinic_name,
      clinic_address: this.doctors[1].clinic_address,
      appointment_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      start_time: '10:15:00',
      end_time: '10:30:00',
      status: 'completed',
      consultation_type: 'in_person',
      fee: this.doctors[1].consultation_fee,
      symptoms: 'Seasonal throat irritation and dry cough',
      created_at: new Date(Date.now() - 8 * 86400000).toISOString()
    });

    // 9. Laboratory Bookings
    const lab1 = this.laboratories[0];
    const tst1 = this.tests[0];
    this.laboratoryBookings.push({
      id: 'lbd-001',
      booking_id: 'LBD5001',
      patient_id: pat.id,
      patient_name: pat.full_name,
      lab_id: lab1.id,
      lab_name: lab1.name,
      test_id: tst1.id,
      test_name: tst1.name,
      booking_date: todayStr,
      preferred_time_slot: '8:00 AM - 10:00 AM',
      collection_type: 'home_collection',
      collection_address: pat.address,
      collection_city: pat.city,
      status: 'completed',
      total_amount: tst1.default_price + lab1.home_collection_fee,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    });

    // 10. Medical Records / Prescriptions
    // Prescription Filename Pattern: PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
    this.prescriptions.push({
      id: 'rx-001',
      prescription_id: 'PRX1001',
      record_id: 'RPT000001',
      appointment_id: 'apt-002',
      patient_id: pat.id,
      patient_unique_id: pat.patient_id,
      doctor_id: doc1.id,
      doctor_unique_id: doc1.doctor_id,
      doctor_name: doc1.full_name,
      disease_id: 'dis-001',
      disease_unique_id: 'DIS000001',
      disease_name: 'Type 2 Diabetes Mellitus',
      medications: [
        { name: 'Tab Metformin', dosage: '500mg', frequency: '1-0-1', duration: '30 days', instructions: 'After food' },
        { name: 'Tab Telmisartan', dosage: '40mg', frequency: '1-0-0', duration: '30 days', instructions: 'Morning empty stomach' }
      ],
      dosage_instructions: 'Maintain low sodium diet and 30 mins brisk walking.',
      follow_up_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      pdf_filename: 'PAI100001-DIS000001-DOC100001-RPT000001.pdf',
      pdf_storage_path: 'PAI100001-DIS000001-DOC100001-RPT000001.pdf',
      file_size_bytes: 845,
      mime_type: 'application/pdf',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    });

    // 11. Laboratory Reports
    // Lab Report Filename Pattern: PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
    this.laboratoryReports.push({
      id: 'rep-001',
      report_id: 'RPT000002',
      lab_booking_id: 'lbd-001',
      patient_id: pat.id,
      patient_unique_id: pat.patient_id,
      lab_id: lab1.id,
      lab_unique_id: lab1.lab_id,
      lab_name: lab1.name,
      test_id: tst1.id,
      test_unique_id: tst1.test_id,
      test_name: tst1.name,
      report_title: 'Complete Blood Count (CBC) Certified Analysis',
      description: 'Automated 5-part hematology analyzer count with peripheral smear examination.',
      report_date: todayStr,
      status: 'Normal',
      test_results: {
        hemoglobin: '14.2 g/dL',
        rbc_count: '4.8 mill/mcL',
        wbc_count: '6,800 /mcL',
        platelets: '2.4 Lakhs /mcL',
        esr: '12 mm/hr'
      },
      pdf_filename: 'PAI100001-TST000001-LAB100001-RPT000002.pdf',
      pdf_storage_path: 'PAI100001-TST000001-LAB100001-RPT000002.pdf',
      file_size_bytes: 910,
      mime_type: 'application/pdf',
      created_at: new Date(Date.now() - 86400000).toISOString()
    });

    // 12. Patient Consent & Gatekeeper
    // Active grant for Doctor Ananya Sharma
    this.patientAccessGrants.push({
      id: 'grant-001',
      grant_id: 'GRN1001',
      doctor_id: doc1.id,
      patient_id: pat.id,
      scope: 'all_records',
      status: 'active',
      granted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString()
    });

    // Pending request from Doctor Vikram Sethi
    this.patientAccessRequests.push({
      id: 'req-001',
      request_id: 'REQ1001',
      doctor_id: this.doctors[3].id,
      doctor_name: this.doctors[3].full_name,
      patient_id: pat.id,
      patient_name: pat.full_name,
      purpose: 'Review past orthopedic spine radiographs and laboratory blood work before consultation.',
      requested_scope: 'all_records',
      status: 'pending',
      requested_at: new Date(Date.now() - 3600000).toISOString()
    });

    // 13. Notifications
    this.notifications.push({
      id: 'notif-001',
      user_id: 'usr-patient-01',
      title: 'Access Request from Dr. Vikram Sethi',
      message: 'Dr. Vikram Sethi requested access to your medical records for upcoming consultation.',
      type: 'consent',
      link_url: '/patient/profile',
      is_read: false,
      created_at: new Date().toISOString()
    });

    this.notifications.push({
      id: 'notif-002',
      user_id: 'usr-patient-01',
      title: 'Lab Report Ready',
      message: 'Your Complete Blood Count report from Metropolis Diagnostics is now available.',
      type: 'report',
      link_url: '/patient/laboratory-reports',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    });

    // 14. Doctor Reviews
    this.doctorReviews.push({
      id: 'rev-001',
      appointment_id: 'apt-002',
      doctor_id: this.doctors[1].id,
      patient_id: pat.id,
      patient_name: 'Aarav P.',
      rating: 10,
      review_text: 'Dr. Rajesh Iyer is incredibly patient and thorough. Prescribed accurate medicines and cleared all doubts about my seasonal cough.',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString()
    });

    // 15. Audit Logs
    this.auditLogs.push({
      id: 'aud-001',
      user_id: 'usr-admin-01',
      user_role: 'admin',
      action: 'DOCTOR_VERIFICATION_APPROVED',
      resource_type: 'doctor',
      resource_id: 'DOC100001',
      ip_address: '127.0.0.1',
      metadata: { doctor_name: 'Dr. Ananya Sharma', registration_number: 'MCI-2012-88231' },
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    });
  }
}

// Singleton database repository
class DatabaseRepository {
  constructor() {
    this.isPg = false;
    this.pool = null;
    this.mem = new InMemoryDB();

    if (config.databaseUrl && config.databaseUrl.startsWith('postgres')) {
      try {
        this.pool = new Pool({
          connectionString: config.databaseUrl,
          ssl: config.env === 'production' ? { rejectUnauthorized: false } : false
        });
        this.isPg = true;
        console.log('✅ Connected to Supabase PostgreSQL database');
      } catch (err) {
        console.warn('⚠️ Supabase PG connection error, falling back to initialized memory repository:', err.message);
        this.isPg = false;
      }
    } else {
      console.log('ℹ️ Running in-memory relational store with seed data (configured for local dev/testing).');
    }
  }

  get store() {
    return this.mem;
  }

  async query(text, params = []) {
    if (this.isPg && this.pool) {
      return await this.pool.query(text, params);
    }
    // For local in-memory execution, return empty or handled by service
    return { rows: [] };
  }
}

export const db = new DatabaseRepository();
