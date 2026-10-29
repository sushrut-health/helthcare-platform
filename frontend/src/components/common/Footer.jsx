import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ShieldCheck, Lock, Heart, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">Sushrut Healthcare</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's unified healthcare management system. Facilitating verified doctor discovery, BookMyShow-style slot booking, NABL diagnostic lab tests, and patient-controlled medical records.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-teal-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Patient-Controlled Gatekeeper Consent</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Patient Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/doctors" className="hover:text-teal-300 transition-colors">Find Doctors by Specialty</Link></li>
              <li><Link to="/laboratories" className="hover:text-teal-300 transition-colors">Book Diagnostic Lab Tests</Link></li>
              <li><Link to="/doctors?specialty=general-physician" className="hover:text-teal-300 transition-colors">General Physicians</Link></li>
              <li><Link to="/doctors?specialty=cardiologist" className="hover:text-teal-300 transition-colors">Cardiologists & Heart Care</Link></li>
            </ul>
          </div>

          {/* Healthcare Providers */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">For Providers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register/doctor" className="hover:text-teal-300 transition-colors">Doctor Registration</Link></li>
              <li><Link to="/register/laboratory" className="hover:text-teal-300 transition-colors">Laboratory Registration</Link></li>
              <li><Link to="/login" className="hover:text-teal-300 transition-colors">Doctor & Lab Portal Login</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-teal-300 transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Security & Regulatory */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Privacy & Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Doctors cannot access historical patient records without explicit patient consent. Medical PDF documents are stored isolated from databases with cryptographic checksums.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Full Auditing & Revocable Grants</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Sushrut Healthcare Platform. All rights reserved.
          </div>
          <div className="flex space-x-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>HIPAA & DISHA Alignment</span>
            <span>Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
