# Sushrut Health: Hospital Appointment & Medical Resource Management System
*(Frontend Visual UI Prototype)*

A complete, interconnected, 51-page visual website prototype built strictly using **HTML5, CSS3, and Vanilla JavaScript (ES6)** with **LocalStorage** demonstration state.

> ⚠️ **IMPORTANT PROTOTYPE DISCLAIMER:**  
> This project is an early-stage visual UI prototype intended to help developers and product designers evaluate appearances, layouts, workflows, and role-based permissions before building the production system.  
> **NO REAL MEDICAL RECORDS, APPOINTMENTS, CREDENTIALS, OR PAYMENTS ARE TRANSMITTED OR PROCESSED.**

---

## 1. Project Purpose & Highlights
- **100% Framework-Free:** Built exclusively using pure semantic HTML5, CSS variables, reset styles, and vanilla JavaScript.
- **51 Interconnected Pages:** Zero dead-end pages or blank placeholders. Every user role has complete operational interfaces.
- **Four Distinct Role Experiences:**
  1. **Patient:** Search doctors, BookMyShow-style 15-minute slot booking, diagnostic test orders with home pickup, medical record vault with simulated PDF viewer, and access permission granting/revoking.
  2. **Doctor:** Consultation queue, weekly working hours & slot configuration engine, patient access request management, gatekeeper record permissions, diagnosis workspace, and prescription generation.
  3. **Laboratory:** Test catalog management, home pickup queues, sample collection lifecycle tracking, and certified PDF report upload simulation.
  4. **Administrator:** Doctor & laboratory credential review queues, account lifecycle oversight, platform appointment audit, and system event audit trails.
- **Medical Privacy Gatekeeper:** Doctors cannot see historical patient records unless the patient explicitly grants access. Laboratories never receive full medical histories. Administrators have zero access to clinical documents.

---

## 2. File & Directory Structure

```text
Sushrut/
├── index.html                   # Master prototype launcher & directory of all 51 pages
├── README.md                    # Complete documentation
├── css/
│   ├── variables.css            # Design system tokens (colors, shadows, radii)
│   ├── reset.css                # CSS reset rules
│   ├── global.css               # Buttons, cards, tables, badges, toast notifications
│   ├── layout.css               # Public header/footer & 4-role responsive dashboard sidebars
│   ├── components.css           # Statistics grids, tabs, filters, avatars, empty states
│   └── responsive.css           # Breakpoints for desktop (1440px), tablet (768px), mobile (375px)
├── js/
│   ├── demo-data.js             # Fictional dataset (doctors, labs, appointments, tests, reports)
│   ├── storage.js               # LocalStorage demo helper with "Reset Demo Data" feature
│   ├── components.js            # Shared HTML component renderers (navbars, footers, sidebars)
│   ├── navigation.js            # Mobile hamburger and sidebar toggle event listeners
│   ├── forms.js                 # Shared form validation and toast notification popups
│   └── app.js                   # Application bootstrap script
└── pages/
    ├── public/                  # 5 Public Pages
    ├── auth/                    # 6 Authentication & Role Switcher Pages
    ├── patient/                 # 13 Patient Portal Pages
    ├── doctor/                  # 9 Doctor Portal Pages
    ├── laboratory/              # 8 Laboratory Portal Pages
    └── admin/                   # 10 Administrator Oversight Pages
```

---

## 3. Complete Checklist of All 51 Pages

### Section A: Public Pages (5 Pages)
- [`pages/public/home.html`](pages/public/home.html) — Homepage with 2-mode hero search, 9 quick-access specialty shortcuts, featured doctors, and partner labs.
- [`pages/public/find-doctors.html`](pages/public/find-doctors.html) — Dynamic doctor directory with specialty, location, search radius, rating, fee filters, and sorting.
- [`pages/public/doctor-profile.html`](pages/public/doctor-profile.html) — Detailed doctor profile with biography, clinic address, weekly consultation schedule, and reviews.
- [`pages/public/find-labs.html`](pages/public/find-labs.html) — Laboratory directory with home-collection filter and diagnostic test pricing.
- [`pages/public/lab-profile.html`](pages/public/lab-profile.html) — Laboratory profile with full test catalog and direct test scheduling.

### Section B: Authentication (6 Pages)
- [`pages/auth/login.html`](pages/auth/login.html) — Sign-in interface featuring a **1-Click Prototype Role Switcher** for instant inspection of Patient, Doctor, Lab, and Admin portals.
- [`pages/auth/register-patient.html`](pages/auth/register-patient.html) — Patient registration form with input validation.
- [`pages/auth/register-doctor.html`](pages/auth/register-doctor.html) — Doctor registration with credential uploads and "Pending Admin Review" notice.
- [`pages/auth/register-lab.html`](pages/auth/register-lab.html) — Laboratory registration with NABL accreditation upload simulation.
- [`pages/auth/forgot-password.html`](pages/auth/forgot-password.html) — Password recovery demonstration.
- [`pages/auth/reset-password.html`](pages/auth/reset-password.html) — Password reset demonstration.

### Section C: Patient Module (13 Pages)
- [`pages/patient/dashboard.html`](pages/patient/dashboard.html) — Patient overview with upcoming appointments, recent prescriptions, recent lab reports, vitals overview, and quick actions.
- [`pages/patient/find-doctors.html`](pages/patient/find-doctors.html) — Authenticated doctor search within dashboard layout.
- [`pages/patient/doctor-details.html`](pages/patient/doctor-details.html) — Full doctor profile with slot booking initiation.
- [`pages/patient/book-appointment.html`](pages/patient/book-appointment.html) — **BookMyShow-style 15-minute slot picker** across morning, afternoon, and evening intervals.
- [`pages/patient/appointment-confirmation.html`](pages/patient/appointment-confirmation.html) — Booking summary, simulated confirmation, and LocalStorage persistence.
- [`pages/patient/my-appointments.html`](pages/patient/my-appointments.html) — Tabbed view of Upcoming, Completed, and Cancelled appointments with cancellation actions.
- [`pages/patient/appointment-details.html`](pages/patient/appointment-details.html) — Appointment reference, consultation fee, clinic location, and 4-step progress timeline.
- [`pages/patient/medical-records.html`](pages/patient/medical-records.html) — Centralized medical records vault with category filters.
- [`pages/patient/prescriptions.html`](pages/patient/prescriptions.html) — Prescription archive with direct links to the PDF document viewer.
- [`pages/patient/lab-reports.html`](pages/patient/lab-reports.html) — Diagnostic lab reports archive with test result statuses.
- [`pages/patient/document-viewer.html`](pages/patient/document-viewer.html) — **PDF Document Viewer** featuring Zoom In/Out, Print, and simulated Download.
- [`pages/patient/book-lab-tests.html`](pages/patient/book-lab-tests.html) — Diagnostic test picker with conditional address display for home sample collection.
- [`pages/patient/profile-settings.html`](pages/patient/profile-settings.html) — Patient profile settings and **Doctor Medical Record Permission Grant/Revoke Controls**.

### Section D: Doctor Module (9 Pages)
- [`pages/doctor/dashboard.html`](pages/doctor/dashboard.html) — Doctor overview with today's queue, weekly consultation load chart, and pending record requests.
- [`pages/doctor/todays-appointments.html`](pages/doctor/todays-appointments.html) — Daily appointment schedule with access permission indicators.
- [`pages/doctor/appointment-calendar.html`](pages/doctor/appointment-calendar.html) — Full monthly interactive calendar with daily consultation badges.
- [`pages/doctor/manage-availability.html`](pages/doctor/manage-availability.html) — **Weekly availability and 15-minute slot generator engine** with live preview.
- [`pages/doctor/appointment-details.html`](pages/doctor/appointment-details.html) — Clinical consultation details with medical record permission gating.
- [`pages/doctor/access-requests.html`](pages/doctor/access-requests.html) — Patient medical record access request tracker.
- [`pages/doctor/patient-records.html`](pages/doctor/patient-records.html) — Patient records view with interactive **Permission Simulation Sandbox**.
- [`pages/doctor/diagnosis-prescription.html`](pages/doctor/diagnosis-prescription.html) — Clinical workspace with dynamic medication row additions and prescription generation.
- [`pages/doctor/profile-settings.html`](pages/doctor/profile-settings.html) — Doctor professional bio, clinic address, and fee editor.

### Section E: Laboratory Module (8 Pages)
- [`pages/laboratory/dashboard.html`](pages/laboratory/dashboard.html) — Lab metrics, collection queues, and recent report releases.
- [`pages/laboratory/profile.html`](pages/laboratory/profile.html) — Laboratory accreditation, hours, and home collection settings.
- [`pages/laboratory/tests-services.html`](pages/laboratory/tests-services.html) — Diagnostic test catalog editor with price updating.
- [`pages/laboratory/bookings.html`](pages/laboratory/bookings.html) — Test bookings management across home collection and lab visits.
- [`pages/laboratory/booking-details.html`](pages/laboratory/booking-details.html) — Sample collection tracking with lifecycle status transitions.
- [`pages/laboratory/upload-report.html`](pages/laboratory/upload-report.html) — Lab report upload form with local PDF file selection preview.
- [`pages/laboratory/report-history.html`](pages/laboratory/report-history.html) — Complete archive of published diagnostic PDF reports.
- [`pages/laboratory/settings.html`](pages/laboratory/settings.html) — Service area radius and notification preferences.

### Section F: Admin Module (10 Pages)
- [`pages/admin/dashboard.html`](pages/admin/dashboard.html) — Platform governance overview with credential queues and privacy safeguards.
- [`pages/admin/doctor-approvals.html`](pages/admin/doctor-approvals.html) — Pending doctor applications table.
- [`pages/admin/doctor-verification.html`](pages/admin/doctor-verification.html) — Credential verification workspace with Approve / Reject actions.
- [`pages/admin/lab-approvals.html`](pages/admin/lab-approvals.html) — Pending laboratory applications queue.
- [`pages/admin/lab-verification.html`](pages/admin/lab-verification.html) — Laboratory accreditation audit workspace.
- [`pages/admin/patients.html`](pages/admin/patients.html) — Patient account directory without medical record exposure.
- [`pages/admin/doctors.html`](pages/admin/doctors.html) — Complete doctor roster with licensing statuses.
- [`pages/admin/laboratories.html`](pages/admin/laboratories.html) — Complete laboratory roster with verification badges.
- [`pages/admin/appointments.html`](pages/admin/appointments.html) — Platform-wide appointment metadata oversight.
- [`pages/admin/settings-audit-logs.html`](pages/admin/settings-audit-logs.html) — **Security Audit Log Table** and master **"Reset Demo Data"** action.

---

## 4. How to Run the Prototype

1. **Option A: VS Code Live Server**
   - Open this repository folder in VS Code.
   - Right click on `index.html` and choose **"Open with Live Server"**.
   - Or start Live Server from the status bar on port 5500 (`http://127.0.0.1:5500/index.html`).

2. **Option B: Python Built-in Static Server**
   - Run in the terminal:
     ```bash
     python3 -m http.server 8000
     ```
   - Open your browser to `http://localhost:8000/index.html`.

3. **Option C: Direct Browser Opening**
   - Because all navigation, stylesheets, and scripts use standard relative paths (e.g. `../../css/global.css`), you can also open `index.html` directly in modern web browsers (Chrome, Edge, Firefox, Safari).

---

## 5. Demonstration State & LocalStorage
- Demonstration data is loaded initially from [`js/demo-data.js`](js/demo-data.js).
- Any bookings created, cancellations performed, profile edits saved, or doctor/lab approval actions taken are safely persisted in `localStorage` under the key `sushrut_demo_store`.
- To restore the initial demonstration state, click the **"Reset Demo Data"** button located on the `index.html` launcher, in the public footer, or on [`pages/admin/settings-audit-logs.html`](pages/admin/settings-audit-logs.html).
