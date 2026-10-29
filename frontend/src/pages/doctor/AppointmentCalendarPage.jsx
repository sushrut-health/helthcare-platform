import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, ArrowRight } from 'lucide-react';

export default function AppointmentCalendarPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/appointments');
        if (res.success) {
          setAppointments(res.appointments);
        }
      } catch (err) {
        console.error('Failed to load appointments for calendar', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const appointmentsOnDate = appointments.filter(a => a.appointment_date === selectedDate);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Schedule Oversight</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Appointment Calendar</h1>
        <p className="text-xs text-slate-500">Overview of patient consultation slots across dates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Date Selector Card */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Select Consultation Date</span>
          </h2>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-bold text-slate-800 mb-4"
          />

          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span>Total Bookings on {selectedDate}:</span>
              <strong className="text-primary font-bold">{appointmentsOnDate.length}</strong>
            </div>
          </div>
        </div>

        {/* Right: Appointments for Selected Date */}
        <div className="lg:col-span-2 card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Appointments for {selectedDate} ({appointmentsOnDate.length})
            </h2>
            <Link to="/doctor/availability" className="text-xs font-semibold text-primary hover:underline">
              Edit Availability Hours
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading calendar bookings..." />
          ) : appointmentsOnDate.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No appointments scheduled for this date.
            </div>
          ) : (
            <div className="space-y-3">
              {appointmentsOnDate.map(apt => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{apt.patient_name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{apt.appointment_id}</span>
                      <StatusBadge status={apt.status} />
                    </div>
                    <span className="text-primary font-semibold text-[11px] mt-0.5 block">
                      {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)} &bull; {apt.consultation_type.replace('_', ' ')}
                    </span>
                    <p className="text-slate-500 text-[11px] mt-1">{apt.symptoms}</p>
                  </div>

                  <Link
                    to={`/doctor/appointments/${apt.id}`}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm"
                  >
                    <span>Consult</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
