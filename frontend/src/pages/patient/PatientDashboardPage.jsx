import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import PDFViewer from '../../components/medical-records/PDFViewer';
import {
  Calendar,
  Pill,
  TestTube2,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building,
  PlusCircle,
  Eye,
  Check,
  X
} from 'lucide-react';

export default function PatientDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/dashboard');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load patient dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRespondToRequest = async (requestId, decision) => {
    try {
      await api.post('/patients/consent/respond', { requestId, decision });
      await loadDashboard();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading patient health dashboard..." />;
  if (!data) return <p className="text-sm text-slate-500">Failed to load dashboard data.</p>;

  const { patient, stats, upcomingAppointments, mostRecentPrescription, recentLabReports, pendingAccessRequests } = data;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-300 text-xs font-semibold uppercase tracking-wider">Patient Portal</span>
              <span className="font-mono text-[11px] bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded border border-teal-500/30">
                {patient.patient_id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {patient.full_name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              {patient.blood_group ? `Blood Group: ${patient.blood_group} | ` : ''}
              {patient.city || 'Mumbai'} | All health records sovereignly protected
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/patient/doctors"
              className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor</span>
            </Link>
            <Link
              to="/patient/laboratory-tests"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <TestTube2 className="w-4 h-4" />
              <span>Order Lab Test</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Pending Access Requests Alert Gatekeeper */}
      {pendingAccessRequests && pendingAccessRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h3 className="text-sm font-bold text-amber-900">
              Doctor Medical Record Access Request ({pendingAccessRequests.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingAccessRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-slate-900 font-bold block">{req.doctor_name || 'Consulting Physician'}</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">{req.purpose}</p>
                  <span className="text-[10px] text-slate-400">Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRespondToRequest(req.id, 'approve')}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Access
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(req.id, 'reject')}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    <X className="w-3.5 h-3.5" /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Metrics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Upcoming Consults</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.upcomingAppointmentsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled slots</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Prescriptions</span>
            <Pill className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.totalPrescriptionsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Digitally authorized</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Diagnostic Reports</span>
            <TestTube2 className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.totalLabReportsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">NABL certified</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Consent Status</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">Active</span>
          <span className="text-[11px] text-emerald-600 mt-1 block">Gatekeeper Enabled</span>
        </div>
      </div>

      {/* 4. Upcoming Appointments & Most Recent Prescription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Appointments */}
        <div className="lg:col-span-2 card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Upcoming Appointments</span>
            </h2>
            <Link to="/patient/appointments" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No upcoming appointments scheduled.{' '}
              <Link to="/patient/doctors" className="text-primary font-bold hover:underline">
                Find a doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{apt.doctor_name}</strong>
                      <span className="text-[10px] text-primary font-semibold">{apt.specialty_name}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{apt.clinic_name} &bull; {apt.clinic_address}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-slate-600 font-medium text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StatusBadge status={apt.status} />
                    <Link
                      to={`/patient/appointments/${apt.id}`}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Most Recent Prescription */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Latest Prescription</span>
            </h2>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-primary hover:underline">
              All
            </Link>
          </div>

          {mostRecentPrescription ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60">
                <span className="text-[10px] text-primary font-bold uppercase block">Condition Diagnosis</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{mostRecentPrescription.disease_name}</strong>
                <span className="text-[11px] text-slate-500 block mt-1">Prescribed by {mostRecentPrescription.doctor_name}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Medications Prescribed
                </span>
                <div className="space-y-1.5">
                  {(mostRecentPrescription.medications || []).map((med, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="font-semibold text-slate-800">{med.name} {med.dosage}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{med.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveViewerDoc({ id: mostRecentPrescription.id, filename: mostRecentPrescription.pdf_filename })}
                className="w-full btn-primary py-2 text-xs font-semibold flex items-center justify-center gap-1.5 mt-2 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Authorized PDF</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">No clinical prescriptions on file yet.</p>
          )}
        </div>
      </div>

      {/* 5. Recent Lab Reports Grid */}
      <div className="card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-indigo-600" />
            <span>Recent Certified Laboratory Reports</span>
          </h2>
          <Link to="/patient/laboratory-reports" className="text-xs font-semibold text-primary hover:underline">
            View All Reports
          </Link>
        </div>

        {recentLabReports.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No laboratory reports uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLabReports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-primary font-bold uppercase">{rep.test_name}</span>
                    <StatusBadge status={rep.status} />
                  </div>
                  <strong className="text-slate-900 font-bold block mb-1">{rep.report_title}</strong>
                  <p className="text-slate-500 text-[11px]">{rep.lab_name}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">{rep.report_date}</span>
                  <button
                    onClick={() => setActiveViewerDoc({ id: rep.id, filename: rep.pdf_filename })}
                    className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Open PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {activeViewerDoc && (
        <PDFViewer
          documentId={activeViewerDoc.id}
          filename={activeViewerDoc.filename}
          onClose={() => setActiveViewerDoc(null)}
        />
      )}
    </div>
  );
}
