import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Stethoscope, TestTube2, ArrowRight } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role, destination) => {
    try {
      await switchRole(role);
      navigate(destination);
    } catch (e) {
      console.error('Role switch failed', e);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white tracking-wide uppercase text-[10px]">1-Click Role Switcher:</span>
        <span className="text-slate-400 hidden sm:inline">Current: <strong className="text-teal-300 capitalize">{user ? `${user.role} (${user.uniqueId || user.email})` : 'Public Visitor'}</strong></span>
      </div>

      <div className="flex items-center space-x-1.5 overflow-x-auto">
        <button
          onClick={() => handleSwitch('patient', '/patient/dashboard')}
          className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-all ${user?.role === 'patient' ? 'bg-primary text-white font-medium shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
        >
          <User className="w-3 h-3 text-teal-300" />
          <span>Patient</span>
        </button>

        <button
          onClick={() => handleSwitch('doctor', '/doctor/dashboard')}
          className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-all ${user?.role === 'doctor' ? 'bg-primary text-white font-medium shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
        >
          <Stethoscope className="w-3 h-3 text-teal-300" />
          <span>Doctor</span>
        </button>

        <button
          onClick={() => handleSwitch('laboratory', '/laboratory/dashboard')}
          className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-all ${user?.role === 'laboratory' ? 'bg-primary text-white font-medium shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
        >
          <TestTube2 className="w-3 h-3 text-teal-300" />
          <span>Laboratory</span>
        </button>

        <button
          onClick={() => handleSwitch('admin', '/admin/dashboard')}
          className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-all ${user?.role === 'admin' ? 'bg-primary text-white font-medium shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
        >
          <Shield className="w-3 h-3 text-teal-300" />
          <span>Admin</span>
        </button>

        {user && (
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-2 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 transition-all ml-2"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
