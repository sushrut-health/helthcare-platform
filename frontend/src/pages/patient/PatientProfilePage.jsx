import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Ban,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileText,
  Save,
  Check,
  X
} from 'lucide-react';

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [consentData, setConsentData] = useState({ grants: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const loadProfileAndConsent = async () => {
    try {
      setLoading(true);
      const [profRes, conRes] = await Promise.all([
        api.get('/patients/profile'),
        api.get('/patients/consent')
      ]);
      if (profRes.success) setProfile(profRes.profile);
      if (conRes.success) setConsentData(conRes.data);
    } catch (err) {
      console.error('Failed to load profile and consent', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndConsent();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put('/patients/profile', profile);
      if (res.success) {
        setMessage('Profile information updated successfully.');
        setProfile(res.profile);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeConsent = async (grantId) => {
    const reason = window.prompt('Reason for revoking medical record access (optional):', 'Consultation finished');
    if (reason === null) return;

    try {
      await api.post('/patients/consent/revoke', { grantId, reason });
      await loadProfileAndConsent();
      setMessage('Consent grant revoked immediately. Doctor can no longer access your records.');
    } catch (err) {
      alert(err.message || 'Revocation failed');
    }
  };

  const handleRespondRequest = async (requestId, decision) => {
    try {
      await api.post('/patients/consent/respond', { requestId, decision });
      await loadProfileAndConsent();
      setMessage(`Access request ${decision === 'approve' ? 'approved' : 'denied'}.`);
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading patient profile & gatekeeper security settings..." />;
  if (!profile) return <p className="text-sm text-slate-500">Profile data unavailable.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Account Settings</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Profile & Sovereign Gatekeeper Privacy</h1>
        <p className="text-xs text-slate-500">Manage your clinical demographic records and control doctor access permissions</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Consent Gatekeeper Control Center */}
      <div className="card p-6 bg-white border border-teal-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient-Controlled Medical Gatekeeper</h2>
              <span className="text-[11px] text-slate-500 block">Doctors can only view your historical health vault when actively authorized</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Protection
          </span>
        </div>

        {/* Pending Requests */}
        {consentData.requests.filter(r => r.status === 'pending').length > 0 && (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-3">
            <span className="text-xs font-bold text-amber-900 block">
              Pending Doctor Authorization Requests ({consentData.requests.filter(r => r.status === 'pending').length})
            </span>
            {consentData.requests.filter(r => r.status === 'pending').map(req => (
              <div key={req.id} className="bg-white p-3.5 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-slate-900 block">{req.doctor_name}</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">{req.purpose}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRespondRequest(req.id, 'approve')}
                    className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Grant Access
                  </button>
                  <button
                    onClick={() => handleRespondRequest(req.id, 'reject')}
                    className="btn-secondary text-xs py-1.5 px-3 text-rose-600 border-rose-200 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Grants List */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Active Doctor Record Permissions ({consentData.grants.filter(g => g.status === 'active').length})
          </h3>

          {consentData.grants.filter(g => g.status === 'active').length === 0 ? (
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              No active doctor permissions currently granted. Your medical vault is 100% private.
            </p>
          ) : (
            <div className="space-y-2.5">
              {consentData.grants.filter(g => g.status === 'active').map(grant => (
                <div key={grant.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{grant.doctor_name}</strong>
                      <span className="text-[10px] text-primary font-semibold">{grant.doctor_specialty}</span>
                      <StatusBadge status={grant.status} />
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Scope: {grant.scope.replace('_', ' ')} &bull; Valid until {grant.expires_at ? new Date(grant.expires_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRevokeConsent(grant.id)}
                    className="btn-secondary text-xs py-1.5 px-3 text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1 font-semibold"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Revoke Access</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Personal Health Profile Form */}
      <div className="card p-6 bg-white border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span>Personal Demographic & Clinical Profile</span>
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.dob || ''}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={profile.gender || 'Male'}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={profile.blood_group || 'B+'}
                onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Residential Address</label>
              <input
                type="text"
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Known Allergies</label>
              <input
                type="text"
                value={profile.allergies || ''}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Shellfish, Dust mites"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Chronic Conditions</label>
              <input
                type="text"
                value={profile.chronic_conditions || ''}
                onChange={(e) => setProfile({ ...profile, chronic_conditions: e.target.value })}
                placeholder="e.g. Type 2 Diabetes, Hypertension"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-5 text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
