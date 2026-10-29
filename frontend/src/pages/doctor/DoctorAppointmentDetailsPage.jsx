import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  KeyRound,
  Pill,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function DoctorAppointmentDetailsPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [consentGranted, setConsentGranted] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestPurpose, setRequestPurpose] = useState('Review past medical history and diagnostic bloodwork');
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aptRes, conRes] = await Promise.all([
          api.get('/doctors/appointments'),
          api.get('/doctors/access-requests')
        ]);
        if (aptRes.success) {
          const apt = aptRes.appointments.find(a => a.id === appointmentId || a.appointment_id === appointmentId);
          setAppointment(apt);

          if (apt && conRes.success) {
            // Check if active grant exists for this patient
            const hasGrant = conRes.data?.activeGrants?.some(g => g.patient_id === apt.patient_id);
            setConsentGranted(hasGrant);

            const hasPending = conRes.data?.requests?.some(r => r.patient_id === apt.patient_id && r.status === 'pending');
            setRequestSent(hasPending);
          }
        }
      } catch (err) {
        console.error('Failed to load appointment details', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [appointmentId]);

  const handleSendAccessRequest = async (e) => {
    e.preventDefault();
    setSendingRequest(true);
    try {
      await api.post('/doctors/access-requests', {
        patientId: appointment.patient_id,
        appointmentId: appointment.id,
        purpose: requestPurpose,
        requestedScope: 'all_records'
      });
      setRequestSent(true);
    } catch (err) {
      alert(err.message || 'Request failed');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) return <LoadingSpinner message="Checking appointment & gatekeeper consent state..." />;
  if (!appointment) return <p className="text-sm text-slate-500">Appointment not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/doctor/appointments/today" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Queue
      </Link>

      <div className="card p-6 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {appointment.appointment_id}
              </span>
              <StatusBadge status={appointment.status} />
              <StatusBadge status={appointment.consultation_type} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">Patient Consultation: {appointment.patient_name}</h1>
            <p className="text-xs text-slate-500">{appointment.appointment_date} &bull; {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/doctor/appointments/${appointment.id}/prescription`}
              className="btn-primary text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5"
            >
              <Pill className="w-4 h-4" />
              <span>Issue Prescription</span>
            </Link>
          </div>
        </div>

        {/* Symptoms / Reported Clinical Context */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6 text-xs">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase">Reason for Consultation</span>
          <p className="text-slate-800 text-sm font-medium mt-1">
            {appointment.symptoms || 'General clinical consultation and review.'}
          </p>
        </div>

        {/* Patient-Controlled Consent Gatekeeper Box */}
        <div className="p-5 rounded-xl border text-xs space-y-3 transition-colors bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">Medical Records Gatekeeper Status</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${consentGranted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {consentGranted ? 'Access Granted by Patient' : 'Access Restricted'}
            </span>
          </div>

          {consentGranted ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-emerald-900 font-medium">
                The patient has granted you active permission to review historical diagnostic reports and prescriptions.
              </p>
              <Link
                to={`/doctor/patients/${appointment.patient_id}/medical-records`}
                className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
              >
                Inspect Medical Records
              </Link>
            </div>
          ) : requestSent ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Access request sent to patient. Awaiting patient confirmation in their Sushrut portal.
              </span>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-2 text-slate-600">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>
                  You do not have authorization to view this patient's medical records. Submit a formal purpose-driven access request to the patient.
                </p>
              </div>

              <form onSubmit={handleSendAccessRequest} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  placeholder="State clinical purpose..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap shadow-sm"
                >
                  {sendingRequest ? 'Requesting...' : 'Request Patient Consent'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
