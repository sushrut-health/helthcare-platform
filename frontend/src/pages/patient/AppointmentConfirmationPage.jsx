import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle2, Calendar, Clock, MapPin, Building, ArrowRight, FileText, ShieldCheck } from 'lucide-react';

export default function AppointmentConfirmationPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointment() {
      try {
        setLoading(true);
        // Find appointment in patient appointments
        const res = await api.get('/patients/appointments');
        if (res.success) {
          const apt = res.appointments.find(a => a.id === appointmentId || a.appointment_id === appointmentId);
          setAppointment(apt);
        }
      } catch (err) {
        console.error('Failed to load appointment confirmation', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointment();
  }, [appointmentId]);

  if (loading) return <LoadingSpinner message="Retrieving booking receipt..." />;
  if (!appointment) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Appointment Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-4">Your appointment was committed. You can view it under My Appointments.</p>
        <Link to="/patient/appointments" className="btn-primary text-xs py-2 px-4 inline-flex">Go to My Appointments</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-8 bg-white border border-teal-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Booking Committed</span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Appointment Confirmed!</h1>
        <p className="text-xs text-slate-500 mt-1">
          Reference Code: <strong className="font-mono text-primary font-bold">{appointment.appointment_id}</strong>
        </p>

        {/* Appointment Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left my-6 space-y-4 text-xs">
          <div className="flex justify-between items-start pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Healthcare Practitioner</span>
              <strong className="text-slate-900 text-sm font-bold block">{appointment.doctor_name}</strong>
              <span className="text-primary font-semibold">{appointment.specialty_name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Consultation Fee</span>
              <strong className="text-slate-900 text-sm font-bold">₹{appointment.fee}</strong>
              <span className="text-[10px] text-slate-500 block">Pay at Clinic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span><strong>Date:</strong> {appointment.appointment_date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span><strong>Slot:</strong> {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-slate-600 flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">{appointment.clinic_name}</strong>
              <span>{appointment.clinic_address}</span>
            </div>
          </div>
        </div>

        {/* Consent Note */}
        <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-left flex items-start space-x-2.5 text-xs text-teal-800 mb-6">
          <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Medical Privacy Gating:</strong> The doctor currently does not have access to your historical medical vault. If the doctor requires access during your consultation, they will issue a request that you can authorize in 1-click.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/patient/appointments/${appointment.id}`}
            className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 shadow-sm flex items-center justify-center gap-2"
          >
            <span>View Appointment Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/patient/appointments"
            className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-6"
          >
            My Appointments Queue
          </Link>
        </div>
      </div>
    </div>
  );
}
