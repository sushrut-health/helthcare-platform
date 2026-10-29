import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Building, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function PendingLaboratoriesPage() {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPending() {
      try {
        setLoading(true);
        const res = await api.get('/admin/laboratories/pending');
        if (res.success) {
          setLaboratories(res.laboratories);
        }
      } catch (err) {
        console.error('Failed to load pending laboratories', err);
      } finally {
        setLoading(false);
      }
    }
    loadPending();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Accreditation Review</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Pending Laboratory Verification Requests</h1>
        <p className="text-xs text-slate-500">Review NABL accreditation and diagnostic compliance documentation</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading pending laboratory applications..." />
      ) : laboratories.length === 0 ? (
        <EmptyState
          title="No pending laboratory approvals"
          message="All registered diagnostic centers and pathology laboratories have been reviewed."
          action={
            <Link to="/admin/dashboard" className="btn-primary text-xs py-1.5 px-3">
              Return to Dashboard
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {laboratories.map(lab => (
            <div key={lab.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {lab.lab_id}
                  </span>
                  <StatusBadge status={lab.verification_status} />
                </div>

                <strong className="text-slate-900 font-bold text-sm block">{lab.name}</strong>
                <p className="text-slate-500 text-[11px]">{lab.address}, {lab.city}</p>
                <p className="text-slate-600 text-[11px] font-mono">NABL Accreditation: {lab.nabl_accreditation_number}</p>
              </div>

              <Link
                to={`/admin/laboratories/${lab.id}/verification`}
                className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Inspect Accreditation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
