import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { ShieldAlert, Clock, ArrowRight, Building, Award } from 'lucide-react';

export default function PendingDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPending() {
      try {
        setLoading(true);
        const res = await api.get('/admin/doctors/pending');
        if (res.success) {
          setDoctors(res.doctors);
        }
      } catch (err) {
        console.error('Failed to load pending doctors', err);
      } finally {
        setLoading(false);
      }
    }
    loadPending();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Credential Verification</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Pending Doctor Approval Requests</h1>
        <p className="text-xs text-slate-500">Inspect state medical council registration numbers and qualifications before approving</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading pending credential applications..." />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No pending doctor approvals"
          message="All registered doctor credential applications have been reviewed."
          action={
            <Link to="/admin/dashboard" className="btn-primary text-xs py-1.5 px-3">
              Return to Dashboard
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {doctors.map(doc => (
            <div key={doc.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {doc.doctor_id}
                  </span>
                  <StatusBadge status={doc.verification_status} />
                  <span className="text-primary font-bold">{doc.specialty_name}</span>
                </div>

                <strong className="text-slate-900 font-bold text-sm block">{doc.full_name}</strong>
                <p className="text-slate-500 text-[11px]">{doc.qualifications} &bull; Reg: <span className="font-mono font-bold text-slate-700">{doc.registration_number}</span></p>
                <p className="text-slate-600 text-[11px]">{doc.clinic_name} &bull; {doc.clinic_address}, {doc.city}</p>
              </div>

              <Link
                to={`/admin/doctors/${doc.id}/verification`}
                className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Inspect Verification Credentials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
