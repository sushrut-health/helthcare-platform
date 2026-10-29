import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, User, Bell, LogOut, Search, ShieldCheck } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'patient': return '/patient/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'laboratory': return '/laboratory/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-[33px] z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  Sushrut<span className="text-primary font-normal text-sm ml-1 px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded font-semibold">Health</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 font-medium tracking-wide">RECORDS & CARE PLATFORM</span>
              </div>
            </Link>
          </div>

          {/* Public Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/doctors" className="hover:text-primary transition-colors flex items-center gap-1">
              Find Doctors
            </Link>
            <Link to="/laboratories" className="hover:text-primary transition-colors flex items-center gap-1">
              Diagnostics & Labs
            </Link>
          </nav>

          {/* User Auth Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardLink()}
                  className="btn-primary text-sm py-2 px-3.5 flex items-center space-x-1.5"
                >
                  <User className="w-4 h-4" />
                  <span className="capitalize">{user.role} Portal</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-primary px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register/patient"
                  className="btn-primary text-sm py-2 px-4 shadow-sm"
                >
                  Patient Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
