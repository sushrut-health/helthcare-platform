import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Pill,
  Star,
  ShieldCheck,
  Ban,
  ArrowLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AppointmentDetailsPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [rating, setRating] = useState(10);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aptRes, rxRes] = await Promise.all([
          api.get('/patients/appointments'),
          api.get('/patients/prescriptions')
        ]);
        if (aptRes.success) {
          const apt = aptRes.appointments.find(a => a.id === appointmentId || a.appointment_id === appointmentId);
          setAppointment(apt);

          if (apt && rxRes.success) {
            const rx = rxRes.prescriptions.find(p => p.appointment_id === apt.id);
            setPrescription(rx);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews/submit', {
        appointmentId: appointment.id,
        rating,
        reviewText
      });
      setReviewSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading appointment details..." />;
  if (!appointment) return <p className="text-sm text-slate-500">Appointment not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/patient/appointments" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Appointments
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
            <h1 className="text-xl font-bold text-slate-900 mt-2">Consultation with {appointment.doctor_name}</h1>
            <p className="text-xs text-primary font-semibold">{appointment.specialty_name}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consultation Fee</span>
            <span className="text-lg font-bold text-slate-900">₹{appointment.fee}</span>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs mb-6">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <span className="text-slate-400 block text-[11px]">Date</span>
              <strong className="text-slate-800">{appointment.appointment_date}</strong>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <span className="text-slate-400 block text-[11px]">Time Slot</span>
              <strong className="text-slate-800">{appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</strong>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Building className="w-4 h-4 text-primary" />
            <div>
              <span className="text-slate-400 block text-[11px]">Clinic</span>
              <strong className="text-slate-800">{appointment.clinic_name}</strong>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="text-xs mb-6">
          <h3 className="font-bold text-slate-900 mb-1">Reason for Visit / Reported Symptoms</h3>
          <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {appointment.symptoms || 'General medical follow-up consultation'}
          </p>
        </div>

        {/* Related Prescription if available */}
        {prescription && (
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <div>
                  <strong className="text-slate-900 block">Prescription Available</strong>
                  <span className="text-[11px] text-teal-800">{prescription.disease_name}</span>
                </div>
              </div>
              <Link
                to={`/patient/documents/${prescription.id}`}
                className="btn-primary text-xs py-1.5 px-3 shadow-sm"
              >
                View Prescription PDF
              </Link>
            </div>
          </div>
        )}

        {/* Rating Submission if completed */}
        {appointment.status === 'completed' && !reviewSubmitted && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Rate Your Consultation (Scale 1 to 10)</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div className="flex items-center space-x-3">
                <label className="font-semibold text-slate-700">Rating out of 10:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-primary"
                >
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} / 10</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Review Feedback</label>
                <textarea
                  rows={2}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with Dr. Ananya Sharma..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary text-xs py-1.5 px-4 shadow-sm"
              >
                {submittingReview ? 'Submitting...' : 'Submit Patient Review'}
              </button>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your verified rating and consultation review has been posted.</span>
          </div>
        )}
      </div>
    </div>
  );
}
