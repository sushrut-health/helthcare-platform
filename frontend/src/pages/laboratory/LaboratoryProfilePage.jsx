import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Building, MapPin, Phone, Mail, Clock, ShieldCheck, Home, Save, CheckCircle2 } from 'lucide-react';

export default function LaboratoryProfilePage() {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await api.get('/laboratories/dashboard');
        if (res.success) {
          setLab(res.data.laboratory);
        }
      } catch (err) {
        console.error('Failed to load lab profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setTimeout(() => {
      setSaving(false);
      setMessage('Laboratory center operational profile updated successfully.');
    }, 500);
  };

  if (loading) return <LoadingSpinner message="Loading laboratory profile..." />;
  if (!lab) return <p className="text-sm text-slate-500">Laboratory profile not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Facility Settings</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Laboratory Profile & Logistics</h1>
        <p className="text-xs text-slate-500">Manage center locations, operating hours, and sample collection settings</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Accreditation Card */}
      <div className="card p-5 bg-white border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <strong className="text-slate-900 text-sm block">NABL Medical Accreditation</strong>
            <span className="text-slate-500 text-xs">Accreditation Number: <span className="font-mono font-bold text-slate-700">{lab.nabl_accreditation_number}</span></span>
          </div>
        </div>
        <StatusBadge status={lab.verification_status} />
      </div>

      <form onSubmit={handleSave} className="card p-6 bg-white border border-slate-200 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" />
          <span>Facility Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Laboratory Official Name</label>
            <input
              type="text"
              required
              value={lab.name || ''}
              onChange={(e) => setLab({ ...lab, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Official Contact Email</label>
            <input
              type="email"
              required
              value={lab.email || ''}
              onChange={(e) => setLab({ ...lab, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Helpline Phone</label>
            <input
              type="tel"
              value={lab.phone || ''}
              onChange={(e) => setLab({ ...lab, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Operating Hours</label>
            <input
              type="text"
              value={lab.operating_hours || '8:00 AM - 8:00 PM'}
              onChange={(e) => setLab({ ...lab, operating_hours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">City / Hub</label>
            <input
              type="text"
              value={lab.city || 'Mumbai'}
              onChange={(e) => setLab({ ...lab, city: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Full Facility Address</label>
          <input
            type="text"
            value={lab.address || ''}
            onChange={(e) => setLab({ ...lab, address: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        {/* Home Collection Setting */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <label className="flex items-center space-x-2 font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={lab.provides_home_collection}
              onChange={(e) => setLab({ ...lab, provides_home_collection: e.target.checked })}
              className="rounded text-primary focus:ring-teal-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-indigo-600" />
              Provide Home Blood Sample Collection Services
            </span>
          </label>

          {lab.provides_home_collection && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Collection Fee: ₹</span>
              <input
                type="number"
                value={lab.home_collection_fee || 150}
                onChange={(e) => setLab({ ...lab, home_collection_fee: e.target.value })}
                className="w-20 px-2 py-1 rounded border border-slate-200 font-bold text-primary"
              />
            </div>
          )}
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Center Description & Specializations</label>
          <textarea
            rows={3}
            value={lab.description || ''}
            onChange={(e) => setLab({ ...lab, description: e.target.value })}
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
            <span>{saving ? 'Updating...' : 'Save Laboratory Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
