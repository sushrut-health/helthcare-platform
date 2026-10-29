import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { Stethoscope, Mail, Lock, Phone, Building, Award, ShieldCheck, CheckCircle2, AlertCircle, Loader2, FileUp } from 'lucide-react';

export default function RegisterDoctorPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    specialty: 'Cardiologist',
    qualifications: '',
    registrationNumber: '',
    experienceYears: '10',
    consultationFee: '750',
    clinicName: '',
    clinicAddress: '',
    city: 'Mumbai',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register/doctor', form);
      if (res.success) {
        setSuccessData(res.doctor);
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
        <h2 className="text-xl font-bold text-slate-900 mb-2">Registration Submitted for Verification</h2>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Thank you, <strong>{successData.fullName}</strong>. Your doctor profile has been created with identifier <strong className="font-mono text-primary">{successData.doctorId}</strong>.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 text-left mb-6">
          <strong className="block font-semibold mb-1">Status: Pending Administrative Review</strong>
          In compliance with medical credential verification guidelines, your state medical council registration number will be verified by a Sushrut administrator prior to enabling appointment booking.
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
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Onboarding</h2>
        <p className="text-xs text-slate-500 mt-1">Join the verified clinical network, configure slot availability & receive consult requests</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Doctor Full Name *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Dr. Ananya Sharma"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Primary Specialty *</label>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
            >
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Diabetes Specialist">Diabetes Specialist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Orthopedic Specialist">Orthopedic Specialist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Psychiatrist">Psychiatrist</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doctor@sushrut.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mobile Phone *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98111 22334"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Qualifications *</label>
            <input
              type="text"
              required
              value={form.qualifications}
              onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              placeholder="MBBS, MD (Cardio)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Medical Reg No *</label>
            <input
              type="text"
              required
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              placeholder="MCI-2015-8899"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Fee (INR) *</label>
            <input
              type="number"
              required
              value={form.consultationFee}
              onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
              placeholder="750"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic / Hospital Name *</label>
            <input
              type="text"
              required
              value={form.clinicName}
              onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
              placeholder="Apex Heart & Vascular Centre"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Practice Location / Area *</label>
            <input
              type="text"
              required
              value={form.clinicAddress}
              onChange={(e) => setForm({ ...form, clinicAddress: e.target.value })}
              placeholder="Bandra West, Mumbai"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Password *</label>
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

        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-primary" />
            <span>Registration Certificate & Degree Upload</span>
          </div>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">Auto-Simulated PDF</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Credential Application...</span>
            </>
          ) : (
            <span>Submit Doctor Verification Request</span>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500">
        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
