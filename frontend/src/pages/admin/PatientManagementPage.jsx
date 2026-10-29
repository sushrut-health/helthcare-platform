import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Users, Search, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function PatientManagementPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        const res = await api.get('/admin/patients');
        if (res.success) {
          setPatients(res.patients);
        }
      } catch (err) {
        console.error('Failed to load patients for admin', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patients.filter(p => {
    if (search && !p.full_name?.toLowerCase().includes(search.toLowerCase()) && !p.patient_id?.toLowerCase().includes(search.toLowerCase()) && !p.email?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Account Governance</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Patient Accounts Directory</h1>
          <p className="text-xs text-slate-500">Administrative account oversight &bull; Strict separation from clinical records</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, PAI ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Clinical Content Redaction:</strong> Private health vault documents, prescriptions, and diagnosis notes are withheld from administrator views.
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading patient accounts..." />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Patient ID & Name</th>
                  <th className="py-3 px-4">Account Email</th>
                  <th className="py-3 px-4">Mobile Phone</th>
                  <th className="py-3 px-4">City / State</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{p.full_name}</strong>
                      <span className="font-mono text-[10px] text-primary font-bold">{p.patient_id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.phone || 'Not provided'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.city || 'Mumbai'}, {p.state || 'Maharashtra'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Account
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {p.created_at?.split('T')[0]}
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
