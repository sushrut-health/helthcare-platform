import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, Clock, ShieldCheck, Search, Filter } from 'lucide-react';

export default function AppointmentOversightPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.success && res.data.recentAppointments) {
          setAppointments(res.data.recentAppointments);
        }
      } catch (err) {
        console.error('Failed to load appointments for admin', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search && !a.doctor_name?.toLowerCase().includes(search.toLowerCase()) && !a.patient_name?.toLowerCase().includes(search.toLowerCase()) && !a.appointment_id?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Operational Telemetry</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Platform Appointment Oversight</h1>
          <p className="text-xs text-slate-500">Monitor scheduling volume, slot fulfillment, and consultation metrics</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search APT reference or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>HIPAA/Privacy Boundary:</strong> Complete clinical notes, diagnosis observations, and private prescription PDFs are withheld from administrative oversight dashboards.
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Aggregating platform consultation telemetry..." />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Appointment Reference</th>
                  <th className="py-3 px-4">Doctor Practitioner</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Scheduled Window</th>
                  <th className="py-3 px-4">Consultation Mode</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {apt.appointment_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{apt.doctor_name}</strong>
                      <span className="text-[10px] text-slate-400">{apt.specialty_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {apt.patient_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{apt.appointment_date}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-600">
                      {apt.consultation_type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ₹{apt.fee}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
