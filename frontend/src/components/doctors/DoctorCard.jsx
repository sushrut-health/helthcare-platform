import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Building, Clock, IndianRupee } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function DoctorCard({ doctor, bookUrlPrefix = '/doctors' }) {
  if (!doctor) return null;

  return (
    <div className="card hover:shadow-md transition-all duration-200 flex flex-col justify-between border border-slate-200/90 hover:border-teal-300">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-primary flex items-center justify-center font-bold text-base shadow-sm">
              {doctor.full_name?.replace('Dr. ', '')[0] || 'D'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-primary transition-colors">
                <Link to={`${bookUrlPrefix}/${doctor.id}`}>{doctor.full_name}</Link>
              </h3>
              <p className="text-xs text-primary font-semibold">{doctor.specialty_name || 'Medical Specialist'}</p>
              <p className="text-[11px] text-slate-500">{doctor.qualifications}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{doctor.rating_avg ? Number(doctor.rating_avg).toFixed(1) : '9.5'}</span>
            <span className="text-[10px] text-amber-600 font-normal">/10</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {doctor.bio || 'Consulting specialist with clinical experience in diagnostic and therapeutic medicine.'}
        </p>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.clinic_name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.clinic_address}, {doctor.city}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consultation Fee</span>
          <span className="text-sm font-bold text-slate-800 flex items-center">
            <IndianRupee className="w-3.5 h-3.5" />
            {doctor.consultation_fee}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`${bookUrlPrefix}/${doctor.id}`}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Profile
          </Link>
          <Link
            to={`/patient/appointments/book/${doctor.id}`}
            className="btn-primary text-xs py-1.5 px-3 shadow-sm"
          >
            Book Slot
          </Link>
        </div>
      </div>
    </div>
  );
}
