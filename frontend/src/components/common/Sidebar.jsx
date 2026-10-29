import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileText,
  Pill,
  TestTube2,
  Clock,
  KeyRound,
  UserCog,
  ShieldCheck,
  CheckCircle,
  Building,
  Users,
  ScrollText,
  UploadCloud,
  FileCheck2,
  Settings
} from 'lucide-react';

export default function Sidebar({ role }) {
  const getNavItems = () => {
    switch (role) {
      case 'patient':
        return [
          { label: 'Overview Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
          { label: 'Find Doctors', path: '/patient/doctors', icon: Search },
          { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
          { label: 'Medical Records', path: '/patient/medical-records', icon: FileText },
          { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
          { label: 'Lab Reports', path: '/patient/laboratory-reports', icon: TestTube2 },
          { label: 'Book Lab Tests', path: '/patient/laboratory-tests', icon: TestTube2 },
          { label: 'Profile & Privacy', path: '/patient/profile', icon: UserCog }
        ];

      case 'doctor':
        return [
          { label: 'Doctor Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
          { label: "Today's Appointments", path: '/doctor/appointments/today', icon: Clock },
          { label: 'Appointment Calendar', path: '/doctor/calendar', icon: Calendar },
          { label: 'Manage Availability', path: '/doctor/availability', icon: Clock },
          { label: 'Patient Access Requests', path: '/doctor/patient-access-requests', icon: KeyRound },
          { label: 'Professional Profile', path: '/doctor/profile', icon: UserCog }
        ];

      case 'laboratory':
        return [
          { label: 'Lab Dashboard', path: '/laboratory/dashboard', icon: LayoutDashboard },
          { label: 'Manage Tests & Services', path: '/laboratory/services', icon: TestTube2 },
          { label: 'Test Bookings', path: '/laboratory/bookings', icon: Calendar },
          { label: 'Upload Lab Report', path: '/laboratory/reports/upload', icon: UploadCloud },
          { label: 'Uploaded Report History', path: '/laboratory/reports', icon: FileCheck2 },
          { label: 'Laboratory Profile', path: '/laboratory/profile', icon: Building },
          { label: 'Operational Settings', path: '/laboratory/settings', icon: Settings }
        ];

      case 'admin':
        return [
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Doctor Approvals', path: '/admin/doctors/pending', icon: ShieldCheck },
          { label: 'Laboratory Approvals', path: '/admin/laboratories/pending', icon: CheckCircle },
          { label: 'Patient Accounts', path: '/admin/patients', icon: Users },
          { label: 'Doctor Directory', path: '/admin/doctors', icon: Building },
          { label: 'Laboratory Directory', path: '/admin/laboratories', icon: Building },
          { label: 'Appointment Oversight', path: '/admin/appointments', icon: Calendar },
          { label: 'Settings & Audit Logs', path: '/admin/settings', icon: ScrollText }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col sticky top-[98px] h-[calc(100vh-98px)] shrink-0 z-30 pt-6">
      <div className="px-5 mb-4 shrink-0">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {role} navigation
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-50 text-primary font-semibold border-l-4 border-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Badge in footer of sidebar - Pinned & Floating at bottom */}
      <div className="p-3 border-t border-slate-100 bg-white/95 backdrop-blur-sm shrink-0">
        <div className="bg-gradient-to-r from-slate-50 to-teal-50/50 p-3 rounded-xl border border-teal-100/80 shadow-sm flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shadow-teal-700/20">
            {role[0]}
          </div>
          <div className="overflow-hidden flex-1">
            <span className="text-xs font-bold text-slate-800 block capitalize truncate">{role} Portal</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Active Session
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
