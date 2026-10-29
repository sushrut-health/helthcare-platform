import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { KeyRound, ShieldCheck, Clock, User, ArrowRight } from 'lucide-react';

export default function PatientAccessRequestsPage() {
  const [data, setData] = useState({ requests: [], activeGrants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/access-requests');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load doctor access requests', err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  if (loading) return <LoadingSpinner message="Retrieving patient access grants & requests..." />;

  const { requests, activeGrants } = data;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Gatekeeper Consent</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Patient Medical Record Access Requests</h1>
        <p className="text-xs text-slate-500">Audit trail of record authorization requests and active patient permissions</p>
      </div>

      {/* Active Grants */}
      <div className="card p-6 bg-white border border-teal-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Patient Consent Grants ({activeGrants.length})</span>
        </h2>

        {activeGrants.length === 0 ? (
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            No active patient grants. When patients approve your record requests, they will appear here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {activeGrants.map(grant => (
              <div key={grant.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{grant.patient_name}</strong>
                    <span className="font-mono text-[10px] text-slate-400">{grant.patient_unique_id}</span>
                    <StatusBadge status={grant.status} />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Scope: {grant.scope?.replace('_', ' ')} &bull; Granted: {new Date(grant.granted_at).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  to={`/doctor/patients/${grant.patient_id}/medical-records`}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm"
                >
                  <span>Open Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request History */}
      <div className="card p-6 bg-white border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Access Request Tracking ({requests.length})</span>
        </h2>

        {requests.length === 0 ? (
          <p className="text-xs text-slate-500">No access requests sent yet.</p>
        ) : (
          <div className="space-y-2.5">
            {requests.map(req => (
              <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{req.patient_name}</strong>
                    <span className="font-mono text-[10px] text-slate-400">{req.request_id}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{req.purpose}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Requested on {new Date(req.requested_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
