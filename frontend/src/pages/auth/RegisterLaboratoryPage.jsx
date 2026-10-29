import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { Building, Mail, Lock, Phone, MapPin, CheckCircle2, AlertCircle, Loader2, Home, FileUp } from 'lucide-react';

export default function RegisterLaboratoryPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: 'Mumbai',
    nablNumber: '',
    providesHomeCollection: true,
    homeCollectionFee: '150',
    operatingHours: '7:00 AM - 9:00 PM',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register/laboratory', form);
      if (res.success) {
        setSuccessData(res.laboratory);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="card p-8 bg-white shadow-xl border border-slate-200 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-100 text-primary flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Laboratory Accreditation Registered</h2>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Application for <strong>{successData.name}</strong> registered under ID <strong className="font-mono text-primary">{successData.labId}</strong>.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 text-left mb-6">
          <strong className="block font-semibold mb-1">Status: Pending Accreditation Review</strong>
          Your NABL accreditation documentation is being reviewed by Sushrut Compliance Officers. Once approved, your center will appear in patient diagnostic directories.
        </div>
        <Link to="/login" className="btn-primary text-xs py-2 px-4 inline-flex">
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-7 bg-white shadow-xl border border-slate-200 max-w-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Diagnostic Lab Registration</h2>
        <p className="text-xs text-slate-500 mt-1">Enroll pathology center, list test packages & process certified digital reports</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Laboratory / Diagnostic Center Name *</label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Metropolis Diagnostics Centre"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="lab@metropolis.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phone / Helpline *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 22 6677 8899"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">NABL Accreditation Certificate No *</label>
            <input
              type="text"
              required
              value={form.nablNumber}
              onChange={(e) => setForm({ ...form, nablNumber: e.target.value })}
              placeholder="NABL-MC-2023-8899"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">City / Region *</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Mumbai"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Complete Center Address *</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Tower A, Healthcare Hub, Lower Parel"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.providesHomeCollection}
              onChange={(e) => setForm({ ...form, providesHomeCollection: e.target.checked })}
              className="rounded text-primary focus:ring-teal-500 w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-indigo-600" />
              Provide Home Blood Sample Collection
            </span>
          </label>
          {form.providesHomeCollection && (
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">Pickup Fee: ₹</span>
              <input
                type="number"
                value={form.homeCollectionFee}
                onChange={(e) => setForm({ ...form, homeCollectionFee: e.target.value })}
                className="w-16 px-2 py-1 rounded border border-slate-200 text-xs"
              />
            </div>
          )}
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Account Password *</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 6 characters"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Accreditation Details...</span>
            </>
          ) : (
            <span>Submit Laboratory Registration</span>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500">
        Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
