/**
 * Sushrut Health - Realistic Fictional Demonstration Data
 */
const DEMO_DATA = {
  currentUser: {
    role: 'patient',
    id: 'PAI001',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+91 98765 43210',
    dob: '1992-05-14',
    gender: 'Male',
    address: '402, Lotus Greens, Sector 45',
    city: 'Mumbai'
  },
  
  doctors: [
    {
      id: "DOC001",
      name: "Dr. Ananya Sharma",
      specialty: "Cardiologist",
      qualifications: "MBBS, MD, DM (Cardiology)",
      experience: 12,
      rating: 9.6,
      reviewsCount: 142,
      fee: 800,
      clinic: "Apex Heart & Vascular Centre",
      address: "Bandra West, Mumbai",
      distance: "2.4 km",
      status: "Approved",
      regNo: "MCI-2012-88231",
      about: "Dr. Ananya Sharma is a senior consultant cardiologist with extensive expertise in preventative cardiology, hypertension management, and non-invasive cardiac imaging.",
      nextSlot: "Today, 4:30 PM",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: "DOC002",
      name: "Dr. Rajesh Iyer",
      specialty: "General Physician",
      qualifications: "MBBS, MD (Internal Medicine)",
      experience: 15,
      rating: 9.4,
      reviewsCount: 218,
      fee: 500,
      clinic: "LifeCare Family Clinic",
      address: "Andheri East, Mumbai",
      distance: "4.1 km",
      status: "Approved",
      regNo: "MCI-2009-44120",
      about: "Dr. Rajesh Iyer specializes in primary care, chronic condition management including diabetes and hypertension, and seasonal infections.",
      nextSlot: "Tomorrow, 10:15 AM",
      availableDays: ["Monday", "Wednesday", "Friday", "Saturday"]
    },
    {
      id: "DOC003",
      name: "Dr. Priya Nair",
      specialty: "Dermatologist",
      qualifications: "MBBS, DVD, MD (Dermatology)",
      experience: 9,
      rating: 9.8,
      reviewsCount: 184,
      fee: 700,
      clinic: "Glow Skin & Hair Clinic",
      address: "Juhu, Mumbai",
      distance: "5.8 km",
      status: "Approved",
      regNo: "MCI-2015-99341",
      about: "Expert in clinical dermatology, acne treatments, eczema, hair loss therapies, and cosmetic dermatology procedures.",
      nextSlot: "Today, 6:00 PM",
      availableDays: ["Tuesday", "Thursday", "Saturday"]
    },
    {
      id: "DOC004",
      name: "Dr. Vikram Sethi",
      specialty: "Orthopedic Specialist",
      qualifications: "MBBS, MS (Orthopedics), M.Ch",
      experience: 18,
      rating: 9.5,
      reviewsCount: 165,
      fee: 900,
      clinic: "Sethi Bone & Joint Hospital",
      address: "Dadra, Mumbai",
      distance: "3.2 km",
      status: "Approved",
      regNo: "MCI-2006-12890",
      about: "Specializes in joint replacement surgeries, sports trauma, arthroscopic knee surgeries, and degenerative spine disorders.",
      nextSlot: "Friday, 11:30 AM",
      availableDays: ["Monday", "Tuesday", "Thursday", "Friday"]
    },
    {
      id: "DOC005",
      name: "Dr. Meera Nambiar",
      specialty: "Pediatrician",
      qualifications: "MBBS, DCH, DNB (Pediatrics)",
      experience: 11,
      rating: 9.7,
      reviewsCount: 310,
      fee: 600,
      clinic: "Little Stars Child Clinic",
      address: "Powai, Mumbai",
      distance: "6.5 km",
      status: "Approved",
      regNo: "MCI-2013-66723",
      about: "Passionate child specialist offering comprehensive newborn care, vaccination, developmental assessments, and pediatric infectious disease management.",
      nextSlot: "Tomorrow, 2:00 PM",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"]
    },
    {
      id: "DOC006",
      name: "Dr. Amitav Banerjee",
      specialty: "Neurologist",
      qualifications: "MBBS, MD, DM (Neurology)",
      experience: 14,
      rating: 9.3,
      reviewsCount: 95,
      fee: 1000,
      clinic: "NeuroPlus Brain Clinic",
      address: "South Mumbai",
      distance: "8.0 km",
      status: "Approved",
      regNo: "MCI-2010-33451",
      about: "Specialist in migraine management, epilepsy, stroke rehabilitation, neuropathies, and neurodegenerative conditions.",
      nextSlot: "Saturday, 10:00 AM",
      availableDays: ["Wednesday", "Saturday", "Sunday"]
    },
    {
      id: "DOC007",
      name: "Dr. Sunita Rao",
      specialty: "Gynecologist",
      qualifications: "MBBS, MS (OBGYN), FICOG",
      experience: 16,
      rating: 9.6,
      reviewsCount: 240,
      fee: 850,
      clinic: "Motherhood & Women Wellness",
      address: "Khar West, Mumbai",
      distance: "3.7 km",
      status: "Approved",
      regNo: "MCI-2008-55219",
      about: "Comprehensive obstetrics, high-risk pregnancy care, PCOS/PCOD management, and laparoscopic gynecological procedures.",
      nextSlot: "Today, 5:15 PM",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday"]
    },
    {
      id: "DOC008",
      name: "Dr. Rohan Mukherjee",
      specialty: "Psychiatrist",
      qualifications: "MBBS, MD (Psychiatry)",
      experience: 8,
      rating: 9.2,
      reviewsCount: 78,
      fee: 900,
      clinic: "MindSpace Mental Health Clinic",
      address: "Versova, Mumbai",
      distance: "7.1 km",
      status: "Approved",
      regNo: "MCI-2016-77821",
      about: "Compassionate mental health consultation focusing on anxiety disorders, depression, work-life stress, and cognitive behavioral approaches.",
      nextSlot: "Thursday, 4:00 PM",
      availableDays: ["Tuesday", "Thursday", "Friday"]
    },
    {
      id: "DOC009",
      name: "Dr. Kavita Verma",
      specialty: "Diabetes Specialist",
      qualifications: "MBBS, C.Diab, MD",
      experience: 13,
      rating: 9.5,
      reviewsCount: 190,
      fee: 650,
      clinic: "EndoCare Metabolic Centre",
      address: "Chembur, Mumbai",
      distance: "5.0 km",
      status: "Pending",
      regNo: "MCI-2011-48291",
      about: "Expert endocrinologist and diabetologist specializing in Type 1 & 2 diabetes, gestational diabetes, and thyroid disorders.",
      nextSlot: "Tomorrow, 11:00 AM",
      availableDays: ["Monday", "Wednesday", "Friday"]
    }
  ],

  laboratories: [
    {
      id: "LAB001",
      name: "ThyroCare Diagnostics Hub",
      address: "Plot 12, Central Avenue, Powai, Mumbai",
      city: "Mumbai",
      contactPerson: "Dr. Sanjay Gupta",
      phone: "+91 22 2570 1122",
      email: "contact@thyrocare-hub.demo",
      rating: 9.5,
      homeCollection: true,
      status: "Approved",
      regNo: "NABL-2018-0912",
      operatingHours: "07:00 AM - 08:00 PM",
      testsCount: 42
    },
    {
      id: "LAB002",
      name: "Metropolis Clinical Lab",
      address: "Shop 4, Sunrise Plaza, Bandra West, Mumbai",
      city: "Mumbai",
      contactPerson: "Nisha Kapoor",
      phone: "+91 22 2640 4433",
      email: "info@metropolis-bandra.demo",
      rating: 9.3,
      homeCollection: true,
      status: "Approved",
      regNo: "NABL-2019-3314",
      operatingHours: "06:30 AM - 09:00 PM",
      testsCount: 65
    },
    {
      id: "LAB003",
      name: "Suburban Diagnostic Centre",
      address: "Ground Floor, Navjivan Complex, Andheri, Mumbai",
      city: "Mumbai",
      contactPerson: "Dr. Cyrus Mistry",
      phone: "+91 22 2680 5566",
      email: "support@suburbandiag.demo",
      rating: 9.1,
      homeCollection: false,
      status: "Approved",
      regNo: "NABL-2017-7712",
      operatingHours: "07:30 AM - 07:30 PM",
      testsCount: 38
    },
    {
      id: "LAB004",
      name: "Precision BioPath Diagnostics",
      address: "Sector 17, Vashi, Navi Mumbai",
      city: "Navi Mumbai",
      contactPerson: "Amit Deshmukh",
      phone: "+91 22 2780 9900",
      email: "help@precisionbiopath.demo",
      rating: 9.0,
      homeCollection: true,
      status: "Pending",
      regNo: "NABL-2022-4419",
      operatingHours: "07:00 AM - 06:00 PM",
      testsCount: 29
    }
  ],

  labTests: [
    {
      id: "TST001",
      name: "Complete Blood Count (CBC)",
      category: "Hematology",
      price: 350,
      sampleType: "Blood",
      fasting: "Not required",
      turnaround: "12 Hours",
      description: "Measures overall health and detects a wide range of disorders, including anemia and infection."
    },
    {
      id: "TST002",
      name: "Fasting Blood Glucose",
      category: "Biochemistry",
      price: 180,
      sampleType: "Blood",
      fasting: "8-10 hours fasting required",
      turnaround: "6 Hours",
      description: "Checks blood glucose levels to screen for prediabetes and diabetes mellitus."
    },
    {
      id: "TST003",
      name: "HbA1c (Glycated Hemoglobin)",
      category: "Diabetes",
      price: 550,
      sampleType: "Blood",
      fasting: "Not required",
      turnaround: "8 Hours",
      description: "Reflects average blood sugar levels over the past 2 to 3 months."
    },
    {
      id: "TST004",
      name: "Lipid Profile Panel",
      category: "Cardiology",
      price: 650,
      sampleType: "Blood",
      fasting: "10-12 hours fasting required",
      turnaround: "24 Hours",
      description: "Measures total cholesterol, HDL, LDL, VLDL, and triglycerides to evaluate cardiovascular risk."
    },
    {
      id: "TST005",
      name: "Thyroid Function Test (T3, T4, TSH)",
      category: "Endocrinology",
      price: 500,
      sampleType: "Blood",
      fasting: "Morning sample preferred",
      turnaround: "12 Hours",
      description: "Evaluates thyroid gland activity and screens for hyperthyroidism or hypothyroidism."
    },
    {
      id: "TST006",
      name: "Liver Function Test (LFT)",
      category: "Biochemistry",
      price: 600,
      sampleType: "Blood",
      fasting: "Fasting preferred",
      turnaround: "24 Hours",
      description: "Measures bilirubin, SGOT, SGPT, alkaline phosphatase, and protein levels in the liver."
    },
    {
      id: "TST007",
      name: "Kidney Function Test (KFT / RFT)",
      category: "Renal",
      price: 550,
      sampleType: "Blood",
      fasting: "Not required",
      turnaround: "12 Hours",
      description: "Evaluates kidney function by measuring blood urea nitrogen (BUN), serum creatinine, and electrolytes."
    }
  ],

  appointments: [
    {
      id: "APT001",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      doctorId: "DOC001",
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiologist",
      date: "2026-10-24",
      time: "10:30 AM",
      fee: 800,
      status: "Scheduled",
      permissionGranted: true,
      reason: "Follow-up consultation for mild hypertension and routine ECG evaluation.",
      timeline: [
        { title: "Appointment Requested", date: "2026-10-18 09:30 AM", done: true },
        { title: "Appointment Confirmed", date: "2026-10-18 10:00 AM", done: true },
        { title: "Consultation", date: "Scheduled for Oct 24, 10:30 AM", done: false },
        { title: "Completed", date: "Pending", done: false }
      ]
    },
    {
      id: "APT002",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      doctorId: "DOC003",
      doctorName: "Dr. Priya Nair",
      specialty: "Dermatologist",
      date: "2026-10-28",
      time: "04:15 PM",
      fee: 700,
      status: "Scheduled",
      permissionGranted: false,
      reason: "Skin allergy flare-up and seasonal rash assessment.",
      timeline: [
        { title: "Appointment Requested", date: "2026-10-19 02:15 PM", done: true },
        { title: "Appointment Confirmed", date: "2026-10-19 02:45 PM", done: true },
        { title: "Consultation", date: "Scheduled for Oct 28, 04:15 PM", done: false },
        { title: "Completed", date: "Pending", done: false }
      ]
    },
    {
      id: "APT003",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      doctorId: "DOC002",
      doctorName: "Dr. Rajesh Iyer",
      specialty: "General Physician",
      date: "2026-09-12",
      time: "11:00 AM",
      fee: 500,
      status: "Completed",
      permissionGranted: true,
      reason: "Annual wellness checkup and seasonal flu consultation.",
      timeline: [
        { title: "Appointment Requested", date: "2026-09-10 11:20 AM", done: true },
        { title: "Appointment Confirmed", date: "2026-09-10 11:30 AM", done: true },
        { title: "Consultation", date: "2026-09-12 11:00 AM", done: true },
        { title: "Completed", date: "2026-09-12 11:45 AM", done: true }
      ]
    }
  ],

  labBookings: [
    {
      id: "LBK001",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      labId: "LAB001",
      labName: "ThyroCare Diagnostics Hub",
      testId: "TST004",
      testName: "Lipid Profile Panel",
      date: "2026-10-25",
      time: "08:30 AM",
      method: "Home Collection",
      address: "402, Lotus Greens, Sector 45, Mumbai",
      status: "Collection Scheduled",
      reportStatus: "Pending",
      price: 650
    },
    {
      id: "LBK002",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      labId: "LAB002",
      labName: "Metropolis Clinical Lab",
      testId: "TST001",
      testName: "Complete Blood Count (CBC)",
      date: "2026-09-15",
      time: "09:00 AM",
      method: "Lab Visit",
      address: "Shop 4, Sunrise Plaza, Bandra West, Mumbai",
      status: "Report Uploaded",
      reportStatus: "Available",
      price: 350
    }
  ],

  prescriptions: [
    {
      id: "RX001",
      patientId: "PAI001",
      doctorId: "DOC002",
      doctorName: "Dr. Rajesh Iyer",
      specialty: "General Physician",
      date: "2026-09-12",
      diagnosis: "Mild Seasonal Viral Pharyngitis & Fatigue",
      medicines: [
        { name: "Paracetamol 650mg", dosage: "1 tablet", frequency: "SOS after meals", duration: "3 days", instructions: "For fever or bodyache" },
        { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once daily at bedtime", duration: "5 days", instructions: "May cause mild drowsiness" },
        { name: "Vitamin C with Zinc", dosage: "1 chewable tab", frequency: "Once daily in morning", duration: "10 days", instructions: "Nutritional support" }
      ],
      notes: "Adequate hydration, warm saline gargles twice daily, and rest."
    }
  ],

  labReports: [
    {
      id: "REP001",
      patientId: "PAI001",
      labId: "LAB002",
      labName: "Metropolis Clinical Lab",
      testName: "Complete Blood Count (CBC)",
      date: "2026-09-15",
      bookingId: "LBK002",
      fileName: "CBC_Aarav_Patel_Sep2026.pdf",
      results: [
        { parameter: "Hemoglobin", value: "14.8", unit: "g/dL", range: "13.0 - 17.0", status: "Normal" },
        { parameter: "WBC Count", value: "7,400", unit: "/cumm", range: "4,000 - 11,000", status: "Normal" },
        { parameter: "Platelet Count", value: "245,000", unit: "/cumm", range: "150,000 - 450,000", status: "Normal" },
        { parameter: "RBC Count", value: "5.1", unit: "mil/cumm", range: "4.5 - 5.5", status: "Normal" }
      ]
    }
  ],

  accessRequests: [
    {
      id: "REQ001",
      doctorId: "DOC003",
      doctorName: "Dr. Priya Nair",
      specialty: "Dermatologist",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      requestDate: "2026-10-19",
      purpose: "Review previous skin allergies and prescription history before consultation.",
      status: "Pending"
    },
    {
      id: "REQ002",
      doctorId: "DOC001",
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiologist",
      patientId: "PAI001",
      patientName: "Aarav Patel",
      requestDate: "2026-10-18",
      purpose: "Evaluation of cardiovascular history and prior lipid profile reports.",
      status: "Approved"
    }
  ],

  auditLogs: [
    { id: "LOG001", actor: "Admin (ADM01)", action: "Approved Doctor Registration", resource: "DOC001 (Dr. Ananya Sharma)", timestamp: "2026-10-15 11:20:04", result: "Success" },
    { id: "LOG002", actor: "Patient (PAI001)", action: "Booked Appointment", resource: "APT001 (Dr. Ananya Sharma)", timestamp: "2026-10-18 09:30:15", result: "Success" },
    { id: "LOG003", actor: "Patient (PAI001)", action: "Granted Medical Record Access", resource: "DOC001", timestamp: "2026-10-18 10:14:02", result: "Success" },
    { id: "LOG004", actor: "Doctor (DOC003)", action: "Requested Record Permission", resource: "PAI001", timestamp: "2026-10-19 14:15:30", result: "Pending" },
    { id: "LOG005", actor: "Laboratory (LAB002)", action: "Uploaded Diagnostic Report", resource: "REP001 (CBC)", timestamp: "2026-09-15 17:45:10", result: "Success" }
  ]
};

// Make available globally
window.DEMO_DATA = DEMO_DATA;
