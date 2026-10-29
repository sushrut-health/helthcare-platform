import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import LaboratoryLayout from './layouts/LaboratoryLayout';
import AdminLayout from './layouts/AdminLayout';

// Category A: Public Pages (5 Pages)
import HomePage from './pages/public/HomePage';
import FindDoctorsPage from './pages/public/FindDoctorsPage';
import DoctorProfilePage from './pages/public/DoctorProfilePage';
import FindLaboratoriesPage from './pages/public/FindLaboratoriesPage';
import LaboratoryProfilePage from './pages/public/LaboratoryProfilePage';

// Category B: Authentication Pages (6 Pages)
import LoginPage from './pages/auth/LoginPage';
import RegisterPatientPage from './pages/auth/RegisterPatientPage';
import RegisterDoctorPage from './pages/auth/RegisterDoctorPage';
import RegisterLaboratoryPage from './pages/auth/RegisterLaboratoryPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Category C: Patient Pages (13 Pages)
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import PatientDoctorSearchPage from './pages/patient/PatientDoctorSearchPage';
import PatientDoctorDetailsPage from './pages/patient/PatientDoctorDetailsPage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import AppointmentConfirmationPage from './pages/patient/AppointmentConfirmationPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import AppointmentDetailsPage from './pages/patient/AppointmentDetailsPage';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';
import PrescriptionsPage from './pages/patient/PrescriptionsPage';
import LaboratoryReportsPage from './pages/patient/LaboratoryReportsPage';
import DocumentViewerPage from './pages/patient/DocumentViewerPage';
import BookLabTestsPage from './pages/patient/BookLabTestsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';

// Category D: Doctor Pages (9 Pages)
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import TodayAppointmentsPage from './pages/doctor/TodayAppointmentsPage';
import AppointmentCalendarPage from './pages/doctor/AppointmentCalendarPage';
import ManageAvailabilityPage from './pages/doctor/ManageAvailabilityPage';
import DoctorAppointmentDetailsPage from './pages/doctor/DoctorAppointmentDetailsPage';
import PatientAccessRequestsPage from './pages/doctor/PatientAccessRequestsPage';
import PatientMedicalRecordsPage from './pages/doctor/PatientMedicalRecordsPage';
import DiagnosisPrescriptionPage from './pages/doctor/DiagnosisPrescriptionPage';
import DoctorOwnProfilePage from './pages/doctor/DoctorProfilePage';

// Category E: Laboratory Pages (8 Pages)
import LaboratoryDashboardPage from './pages/laboratory/LaboratoryDashboardPage';
import LaboratoryOwnProfilePage from './pages/laboratory/LaboratoryProfilePage';
import ManageServicesPage from './pages/laboratory/ManageServicesPage';
import TestBookingsPage from './pages/laboratory/TestBookingsPage';
import LaboratoryBookingDetailsPage from './pages/laboratory/LaboratoryBookingDetailsPage';
import UploadReportPage from './pages/laboratory/UploadReportPage';
import ReportHistoryPage from './pages/laboratory/ReportHistoryPage';
import LaboratorySettingsPage from './pages/laboratory/LaboratorySettingsPage';

// Category F: Administrator Pages (10 Pages)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PendingDoctorsPage from './pages/admin/PendingDoctorsPage';
import DoctorVerificationPage from './pages/admin/DoctorVerificationPage';
import PendingLaboratoriesPage from './pages/admin/PendingLaboratoriesPage';
import LaboratoryVerificationPage from './pages/admin/LaboratoryVerificationPage';
import PatientManagementPage from './pages/admin/PatientManagementPage';
import DoctorManagementPage from './pages/admin/DoctorManagementPage';
import LaboratoryManagementPage from './pages/admin/LaboratoryManagementPage';
import AppointmentOversightPage from './pages/admin/AppointmentOversightPage';
import AdminSettingsAuditLogsPage from './pages/admin/AdminSettingsAuditLogsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* CATEGORY A: PUBLIC PAGES (5 Routes) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<FindDoctorsPage />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
            <Route path="/laboratories" element={<FindLaboratoriesPage />} />
            <Route path="/laboratories/:laboratoryId" element={<LaboratoryProfilePage />} />
          </Route>

          {/* CATEGORY B: AUTHENTICATION PAGES (6 Routes) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/patient" element={<RegisterPatientPage />} />
            <Route path="/register/doctor" element={<RegisterDoctorPage />} />
            <Route path="/register/laboratory" element={<RegisterLaboratoryPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* CATEGORY C: PATIENT PORTAL PAGES (13 Routes) */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboardPage />} />
            <Route path="doctors" element={<PatientDoctorSearchPage />} />
            <Route path="doctors/:doctorId" element={<PatientDoctorDetailsPage />} />
            <Route path="appointments/book/:doctorId" element={<BookAppointmentPage />} />
            <Route path="appointments/confirmation/:appointmentId" element={<AppointmentConfirmationPage />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="appointments/:appointmentId" element={<AppointmentDetailsPage />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="laboratory-reports" element={<LaboratoryReportsPage />} />
            <Route path="documents/:documentId" element={<DocumentViewerPage />} />
            <Route path="laboratory-tests" element={<BookLabTestsPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
          </Route>

          {/* CATEGORY D: DOCTOR PORTAL PAGES (9 Routes) */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="appointments/today" element={<TodayAppointmentsPage />} />
            <Route path="calendar" element={<AppointmentCalendarPage />} />
            <Route path="availability" element={<ManageAvailabilityPage />} />
            <Route path="appointments/:appointmentId" element={<DoctorAppointmentDetailsPage />} />
            <Route path="patient-access-requests" element={<PatientAccessRequestsPage />} />
            <Route path="patients/:patientId/medical-records" element={<PatientMedicalRecordsPage />} />
            <Route path="appointments/:appointmentId/prescription" element={<DiagnosisPrescriptionPage />} />
            <Route path="profile" element={<DoctorOwnProfilePage />} />
          </Route>

          {/* CATEGORY E: LABORATORY PORTAL PAGES (8 Routes) */}
          <Route path="/laboratory" element={<LaboratoryLayout />}>
            <Route path="dashboard" element={<LaboratoryDashboardPage />} />
            <Route path="profile" element={<LaboratoryOwnProfilePage />} />
            <Route path="services" element={<ManageServicesPage />} />
            <Route path="bookings" element={<TestBookingsPage />} />
            <Route path="bookings/:bookingId" element={<LaboratoryBookingDetailsPage />} />
            <Route path="reports/upload" element={<UploadReportPage />} />
            <Route path="reports" element={<ReportHistoryPage />} />
            <Route path="settings" element={<LaboratorySettingsPage />} />
          </Route>

          {/* CATEGORY F: ADMINISTRATOR OVERSIGHT PAGES (10 Routes) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="doctors/pending" element={<PendingDoctorsPage />} />
            <Route path="doctors/:doctorId/verification" element={<DoctorVerificationPage />} />
            <Route path="laboratories/pending" element={<PendingLaboratoriesPage />} />
            <Route path="laboratories/:laboratoryId/verification" element={<LaboratoryVerificationPage />} />
            <Route path="patients" element={<PatientManagementPage />} />
            <Route path="doctors" element={<DoctorManagementPage />} />
            <Route path="laboratories" element={<LaboratoryManagementPage />} />
            <Route path="appointments" element={<AppointmentOversightPage />} />
            <Route path="settings" element={<AdminSettingsAuditLogsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
