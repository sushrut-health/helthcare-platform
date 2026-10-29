import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import RoleSwitcherBar from '../components/common/RoleSwitcherBar';
import { Stethoscope, ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB]">
      <RoleSwitcherBar />
      <header className="p-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Sushrut<span className="text-primary font-normal text-sm ml-1 px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded font-semibold">Health</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-primary">
          Back to Directory
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Sushrut Healthcare Platform &bull; Medical Security & Privacy
      </footer>
    </div>
  );
}
