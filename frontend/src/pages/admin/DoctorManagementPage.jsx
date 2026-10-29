import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Stethoscope, Search, ShieldCheck, Eye, ArrowRight, Building } from 'lucide-react';

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        const res = await api.get('/admin/doctors');
        if (res.success) {
          setDoctors(res.doctors);
        }
      } catch (err) {
        console.error('Failed to load doctors for admin', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const filtered = doctors.filter(d => {
    if (statusFilter !== 'all' && d.verification_status !== statusFilter) return false;
    if (search && !d.full_name?.toLowerCase().includes(search.toLowerCase()) && !d.doctor_id?.toLowerCase().includes(search.toLowerCase()) && !d.specialty_name?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Practitioner Directory</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Doctor Account Directory</h1>
          <p className="text-xs text-slate-500">Monitor practitioner credentials, approval statuses, and practice affiliations</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/admin/doctors/pending" className="btn-primary text-xs py-2 px-3 flex items-center gap-1 shadow-sm">
            <span>Pending Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'approved', 'pending', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${statusFilter === tab ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              {tab} ({doctors.filter(d => tab === 'all' || d.verification_status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, DOC ID, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading doctor directory..." />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Doctor ID & Name</th>
                  <th className="py-3 px-4">Specialty & Qualifications</th>
                  <th className="py-3 px-4">Council Reg Number</th>
                  <th className="py-3 px-4">Clinic & City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{d.full_name}</strong>
                      <span className="font-mono text-[10px] text-primary font-bold">{d.doctor_id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{d.specialty_name}</span>
                      <span className="text-[11px] text-slate-400">{d.qualifications}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {d.registration_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {d.clinic_name}, {d.city}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.verification_status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/doctors/${d.id}/verification`}
                        className="btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" /> Dossier
                      </Link>
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
