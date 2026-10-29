import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
  CheckCircle2,
  TestTube2,
  IndianRupee,
  Calendar,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function LaboratoryProfilePage() {
  const { laboratoryId } = useParams();
  const [lab, setLab] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLabProfile() {
      try {
        setLoading(true);
        const res = await api.get(`/directory/laboratories/${laboratoryId}`);
        if (res.success) {
          setLab(res.laboratory);
          setOfferings(res.offerings || []);
        }
      } catch (err) {
        console.error('Failed to load laboratory profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadLabProfile();
  }, [laboratoryId]);

  if (loading) return <LoadingSpinner message="Loading laboratory profile & test catalog..." />;
  if (!lab) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Laboratory Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-4">This laboratory center could not be found or has not been verified yet.</p>
        <Link to="/laboratories" className="btn-primary text-xs py-2 px-4">Browse Diagnostic Labs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Card */}
      <div className="card p-6 bg-white border border-slate-200 mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center font-bold text-2xl shadow-sm">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{lab.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NABL Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Accreditation: {lab.nabl_accreditation_number}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/patient/laboratory-tests"
              className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
            >
              <span>Schedule Diagnostic Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lab Metadata Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{lab.address}, {lab.city}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{lab.operating_hours || '8:00 AM - 8:00 PM'}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Home className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>{lab.provides_home_collection ? `Home sample pickup (₹${lab.home_collection_fee})` : 'In-center only'}</span>
          </div>
        </div>
      </div>

      {/* Test Catalog Table */}
      <div className="card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Test Menu & Diagnostic Packages</h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated analyzer tests with certified pathologist review</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{offerings.length} tests offered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Test Name & Category</th>
                <th className="py-3 px-4">Sample Type</th>
                <th className="py-3 px-4">Collection Options</th>
                <th className="py-3 px-4">Turnaround Time</th>
                <th className="py-3 px-4">Standard Price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offerings.map(o => {
                const test = o.test;
                if (!test) return null;
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-bold block">{test.name}</strong>
                      <span className="text-[10px] text-primary font-semibold">{test.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {test.sample_type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                        {o.home_collection_available && <Home className="w-3 h-3 text-indigo-600" />}
                        {o.home_collection_available ? 'Center / Home Pickup' : 'Center Visit'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Within {test.turnaround_time_hours || 24} hours
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-sm flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {o.price}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/patient/laboratory-tests?testId=${test.id}&labId=${lab.id}`}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Book Test
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
