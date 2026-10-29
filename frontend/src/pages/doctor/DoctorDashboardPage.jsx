import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Clock,
  Calendar,
  Users,
  KeyRound,
  Star,
  ShieldCheck,
  ArrowRight,
  Pill,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load doctor dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading doctor clinical dashboard..." />;
  if (!data) return <p className="text-sm text-slate-500">Failed to load dashboard data.</p>;

  const { doctor, stats, todayAppointments, upcomingAppointments, recentReviews, pendingAccessRequests } = data;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-300 text-xs font-semibold uppercase tracking-wider">Clinical Workspace</span>
              <span className="font-mono text-[11px] bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded border border-teal-500/30">
                {doctor.doctor_id}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{doctor.full_name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              {doctor.specialty_name} &bull; {doctor.clinic_name} &bull; {doctor.qualifications}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/doctor/appointments/today"
              className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Today's Queue ({stats.todayAppointmentsCount})</span>
            </Link>
            <Link
              to="/doctor/availability"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage Hours</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Today's Patients</span>
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.todayAppointmentsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled for today</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Upcoming Consults</span>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.upcomingAppointmentsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Confirmed bookings</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Record Requests</span>
            <KeyRound className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.pendingAccessRequestsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending patient approval</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Aggregate Rating</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{doctor.rating_avg} <span className="text-xs text-slate-400 font-normal">/ 10</span></span>
          <span className="text-[11px] text-slate-400 mt-1 block">{doctor.total_reviews} patient reviews</span>
        </div>
      </div>

      {/* 3. Today's Consultations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Today's Consultation Schedule</span>
            </h2>
            <Link to="/doctor/appointments/today" className="text-xs font-semibold text-primary hover:underline">
              Full Queue
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-500">
              No appointments scheduled for today. Check upcoming calendar bookings.
            </p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{apt.patient_name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{apt.appointment_id}</span>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-slate-600 mt-0.5">{apt.symptoms || 'General clinical review'}</p>
                    <span className="text-primary font-semibold text-[11px] mt-1 block">
                      {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)} &bull; {apt.consultation_type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/doctor/appointments/${apt.id}`}
                      className="btn-primary text-xs py-1.5 px-3 shadow-sm"
                    >
                      Consult Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Patient Reviews Summary */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Patient Ratings</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{doctor.rating_avg}/10</span>
          </div>

          {recentReviews.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-500">No patient ratings received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{rev.patient_name}</span>
                    <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                      {rev.rating}/10
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{rev.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
