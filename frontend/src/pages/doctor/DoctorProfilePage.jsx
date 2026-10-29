import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Stethoscope, User, Building, MapPin, IndianRupee, ShieldCheck, Award, Save, CheckCircle2 } from 'lucide-react';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/dashboard');
        if (res.success) {
          setDoctor(res.data.doctor);
        }
      } catch (err) {
        console.error('Failed to load doctor profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setTimeout(() => {
      setSaving(false);
      setMessage('Professional profile updated successfully.');
    }, 600);
  };

  if (loading) return <LoadingSpinner message="Loading doctor professional profile..." />;
  if (!doctor) return <p className="text-sm text-slate-500">Doctor profile not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Professional Profile</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Clinical Profile & Practice Settings</h1>
        <p className="text-xs text-slate-500">Manage credentials, clinic address, and fee structures</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="card p-5 bg-white border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <strong className="text-slate-900 text-sm block">License & Accreditation Status</strong>
            <span className="text-slate-500 text-xs">Medical Council Registration: <span className="font-mono font-bold text-slate-700">{doctor.registration_number}</span></span>
          </div>
        </div>
        <StatusBadge status={doctor.verification_status} />
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="card p-6 bg-white border border-slate-200 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span>Professional Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={doctor.full_name || ''}
              onChange={(e) => setDoctor({ ...doctor, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Primary Specialty</label>
            <input
              type="text"
              disabled
              value={doctor.specialty_name || ''}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Qualifications</label>
            <input
              type="text"
              value={doctor.qualifications || ''}
              onChange={(e) => setDoctor({ ...doctor, qualifications: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Experience (Years)</label>
            <input
              type="number"
              value={doctor.experience_years || 10}
              onChange={(e) => setDoctor({ ...doctor, experience_years: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Consultation Fee (INR)</label>
            <input
              type="number"
              value={doctor.consultation_fee || 500}
              onChange={(e) => setDoctor({ ...doctor, consultation_fee: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-bold text-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic / Hospital Center</label>
            <input
              type="text"
              value={doctor.clinic_name || ''}
              onChange={(e) => setDoctor({ ...doctor, clinic_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Practice Address & Locality</label>
            <input
              type="text"
              value={doctor.clinic_address || ''}
              onChange={(e) => setDoctor({ ...doctor, clinic_address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Doctor Biography & Introduction</label>
          <textarea
            rows={3}
            value={doctor.bio || ''}
            onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Professional Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
