import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, User, Stethoscope, TestTube2, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'patient') navigate('/patient/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else if (user.role === 'laboratory') navigate('/laboratory/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password@123');
  };

  return (
    <div className="card p-7 bg-white shadow-xl border border-slate-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Sushrut</h2>
        <p className="text-xs text-slate-500 mt-1">Access your healthcare records, appointments & clinical workflows</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patient@sushrut.com"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-primary hover:underline text-[11px] font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Test Demo Credentials */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2 text-center">
          Instant Demo Account Autofill
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => fillQuickDemo('patient@sushrut.com')}
            className="p-1.5 bg-slate-50 hover:bg-teal-50 hover:text-primary rounded border border-slate-200 text-left transition-colors flex items-center gap-1"
          >
            <User className="w-3 h-3 text-teal-600" /> Patient Demo
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('doctor@sushrut.com')}
            className="p-1.5 bg-slate-50 hover:bg-teal-50 hover:text-primary rounded border border-slate-200 text-left transition-colors flex items-center gap-1"
          >
            <Stethoscope className="w-3 h-3 text-teal-600" /> Doctor Demo
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('lab@sushrut.com')}
            className="p-1.5 bg-slate-50 hover:bg-teal-50 hover:text-primary rounded border border-slate-200 text-left transition-colors flex items-center gap-1"
          >
            <TestTube2 className="w-3 h-3 text-teal-600" /> Lab Demo
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('admin@sushrut.com')}
            className="p-1.5 bg-slate-50 hover:bg-teal-50 hover:text-primary rounded border border-slate-200 text-left transition-colors flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-teal-600" /> Admin Demo
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
        <p>
          New patient? <Link to="/register/patient" className="text-primary font-bold hover:underline">Register here</Link>
        </p>
        <p className="text-[11px] text-slate-400">
          Healthcare Provider? Register as <Link to="/register/doctor" className="text-slate-600 font-semibold hover:underline">Doctor</Link> or <Link to="/register/laboratory" className="text-slate-600 font-semibold hover:underline">Laboratory</Link>
        </p>
      </div>
    </div>
  );
}
