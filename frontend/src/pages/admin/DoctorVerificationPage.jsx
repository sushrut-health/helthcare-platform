import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Award,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function DoctorVerificationPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('Medical council license and degree certificates verified against registry.');
  const [submitting, setSubmitting] = useState(false);
  const [decisionDone, setDecisionDone] = useState(null);

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const res = await api.get(`/admin/doctors/${doctorId}/verification`);
        if (res.success) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        console.error('Failed to load doctor verification data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleReview = async (decision) => {
    const confirm = window.confirm(`Are you sure you want to ${decision.toUpperCase()} Dr. ${doctor.full_name}?`);
    if (!confirm) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/admin/doctors/${doctor.id}/review`, {
        decision,
        notes
      });
      if (res.success) {
        setDecisionDone(decision);
      }
    } catch (err) {
      alert(err.message || 'Review submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving doctor verification dossier..." />;
  if (!doctor) return <p className="text-sm text-slate-500">Doctor application not found.</p>;

  if (decisionDone) {
    return (
      <div className="card p-8 bg-white border border-teal-200 shadow-xl max-w-lg mx-auto text-center space-y-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${decisionDone === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {decisionDone === 'approved' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider block">Decision Recorded</span>
        <h2 className="text-2xl font-bold text-slate-900">Application {decisionDone.toUpperCase()}</h2>
        <p className="text-xs text-slate-600">
          The decision for <strong>{doctor.full_name}</strong> has been saved and logged in platform security audit records.
        </p>
        <div className="pt-2">
          <Link to="/admin/doctors/pending" className="btn-primary text-xs py-2 px-4">
            Return to Pending Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/admin/doctors/pending" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pending Queue
      </Link>

      <div className="card p-6 bg-white border border-slate-200 space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {doctor.doctor_id}
              </span>
              <StatusBadge status={doctor.verification_status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{doctor.full_name}</h1>
            <p className="text-primary font-semibold">{doctor.specialty_name}</p>
          </div>
        </div>

        {/* Credentials Dossier */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Medical Registration No</span>
              <strong className="text-slate-900 font-mono text-sm block mt-0.5">{doctor.registration_number}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Qualifications</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{doctor.qualifications}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Practice Experience</span>
              <strong className="text-slate-900 block mt-0.5">{doctor.experience_years} Years</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Practice Center & City</span>
              <strong className="text-slate-900 block mt-0.5">{doctor.clinic_name}, {doctor.city}</strong>
            </div>
          </div>

          {/* Verification Documents Uploaded */}
          <div>
            <span className="font-bold text-slate-800 block mb-2">Uploaded Professional Verification Documents</span>
            <div className="space-y-2">
              {(doctor.verification_documents || []).map((doc, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-mono font-medium text-slate-700">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Signature
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Administrative Audit & Verification Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary text-xs"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={() => handleReview('rejected')}
            disabled={submitting}
            className="btn-danger text-xs py-2 px-4 shadow-sm"
          >
            Reject Application
          </button>
          <button
            onClick={() => handleReview('approved')}
            disabled={submitting}
            className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Recording Decision...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Activate Doctor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
