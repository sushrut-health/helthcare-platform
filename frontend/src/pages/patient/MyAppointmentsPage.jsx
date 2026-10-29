import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, MapPin, Building, Ban, Eye, AlertCircle } from 'lucide-react';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/appointments');
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    const reason = window.prompt('Please enter a cancellation reason:');
    if (!reason) return;

    try {
      await api.post(`/patients/appointments/${appointmentId}/cancel`, { reason });
      await loadAppointments();
    } catch (err) {
      alert(err.message || 'Cancellation failed');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = appointments.filter(a => {
    if (activeTab === 'cancelled') return a.status === 'cancelled';
    if (activeTab === 'upcoming') return a.appointment_date >= todayStr && a.status === 'confirmed';
    if (activeTab === 'past') return a.appointment_date < todayStr || a.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Patient Bookings</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">My Appointments</h1>
          <p className="text-xs text-slate-500">Track consultation schedules, clinical locations, and status</p>
        </div>
        <Link to="/patient/doctors" className="btn-primary text-xs py-2 px-3.5 inline-flex">
          Book New Consultation
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Upcoming Confirmed
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${activeTab === 'past' ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Consultation History
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${activeTab === 'cancelled' ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <LoadingSpinner message="Fetching your appointments..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} appointments`}
          message="You have no appointments currently listed in this category."
          action={
            <Link to="/patient/doctors" className="btn-primary text-xs py-1.5 px-3">
              Find Doctors & Book
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(apt => (
            <div key={apt.id} className="card p-5 bg-white border border-slate-200/90 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {apt.appointment_id}
                  </span>
                  <StatusBadge status={apt.status} />
                  <span className="text-[10px] font-semibold text-primary">{apt.specialty_name}</span>
                </div>

                <strong className="text-slate-900 font-bold text-sm block">{apt.doctor_name}</strong>
                <p className="text-slate-500 text-[11px]">{apt.clinic_name} &bull; {apt.clinic_address}</p>

                <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {apt.appointment_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}
                  </span>
                  <span>&bull; Fee: ₹{apt.fee}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Link
                  to={`/patient/appointments/${apt.id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </Link>

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="btn-secondary text-xs py-1.5 px-3 text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
