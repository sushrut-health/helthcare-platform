import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Clock, Calendar, User, Pill, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TodayAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToday() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/appointments/today');
        if (res.success) {
          setAppointments(res.appointments);
        }
      } catch (err) {
        console.error('Failed to load today appointments', err);
      } finally {
        setLoading(false);
      }
    }
    loadToday();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Daily Clinical Queue</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Today's Appointments Queue</h1>
          <p className="text-xs text-slate-500">
            Local Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving today's patient queue..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments scheduled today"
          message="There are no patient consultations booked for today's session."
          action={
            <Link to="/doctor/calendar" className="btn-primary text-xs py-1.5 px-3">
              View Monthly Calendar
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {apt.appointment_id}
                  </span>
                  <StatusBadge status={apt.status} />
                  <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold border border-teal-200">
                    {apt.consultation_type.replace('_', ' ')}
                  </span>
                </div>

                <strong className="text-slate-900 font-bold text-sm block">{apt.patient_name}</strong>
                <p className="text-slate-600 text-[11px]">{apt.symptoms || 'General clinical review'}</p>

                <div className="flex items-center gap-3 text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <Clock className="w-3.5 h-3.5" /> {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}
                  </span>
                  <span>&bull; Fee: ₹{apt.fee}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Link
                  to={`/doctor/appointments/${apt.id}`}
                  className="btn-primary text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5"
                >
                  <span>Open Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/doctor/appointments/${apt.id}/prescription`}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                >
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>Prescribe</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
