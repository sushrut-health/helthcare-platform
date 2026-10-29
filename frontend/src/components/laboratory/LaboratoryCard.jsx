import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Home, CheckCircle2, Phone, Clock } from 'lucide-react';

export default function LaboratoryCard({ lab, bookUrlPrefix = '/laboratories' }) {
  if (!lab) return null;

  return (
    <div className="card hover:shadow-md transition-all duration-200 flex flex-col justify-between border border-slate-200/90 hover:border-teal-300">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-primary transition-colors">
              <Link to={`${bookUrlPrefix}/${lab.id}`}>{lab.name}</Link>
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              NABL Accredited & Certified
            </span>
          </div>
          {lab.provides_home_collection && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex-shrink-0">
              <Home className="w-3 h-3" /> Home Pickup
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {lab.description || 'Full-service diagnostic pathology laboratory with certified clinical reporting.'}
        </p>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{lab.address}, {lab.city}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{lab.operating_hours || '8:00 AM - 8:00 PM'}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pickup Charge</span>
          <span className="text-xs font-bold text-slate-700">
            {lab.provides_home_collection ? `₹${lab.home_collection_fee || 100} / visit` : 'At Center Only'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`${bookUrlPrefix}/${lab.id}`}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Catalog
          </Link>
          <Link
            to={`/patient/laboratory-tests`}
            className="btn-primary text-xs py-1.5 px-3"
          >
            Book Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
