import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import DoctorCard from '../../components/doctors/DoctorCard';
import LaboratoryCard from '../../components/laboratory/LaboratoryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  Heart,
  Activity,
  Baby,
  Smile,
  Eye,
  Stethoscope,
  Sparkles,
  Bone,
  Brain,
  UserCheck
} from 'lucide-react';

const specialtyIcons = {
  'general-physician': Stethoscope,
  'diabetes-specialist': Activity,
  'cardiologist': Heart,
  'dermatologist': Sparkles,
  'orthopedic-specialist': Bone,
  'pediatrician': Baby,
  'gynecologist': UserCheck,
  'neurologist': Brain,
  'psychiatrist': Smile
};

export default function HomePage() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [partnerLabs, setPartnerLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero search state
  const [searchMode, setSearchMode] = useState('doctors'); // 'doctors' or 'labs'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [specRes, docRes, labRes] = await Promise.all([
          api.get('/directory/specialties'),
          api.get('/directory/doctors'),
          api.get('/directory/laboratories')
        ]);
        if (specRes.success) setSpecialties(specRes.specialties);
        if (docRes.success) setFeaturedDoctors(docRes.doctors.slice(0, 3));
        if (labRes.success) setPartnerLabs(labRes.laboratories.slice(0, 2));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchMode === 'doctors') {
      navigate(`/doctors?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchCity)}`);
    } else {
      navigate(`/laboratories?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchCity)}`);
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#167D8D_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Full-Stack Healthcare Management & Gatekeeper Consent</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Comprehensive Medical Care,<br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-300">
              Verified Doctors & Sovereign Health Records
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-light">
            Book 15-minute consultations with top verified specialists, schedule diagnostic home blood collection, and securely control who can access your clinical medical history.
          </p>

          {/* Search Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-800 text-left border border-slate-100">
            {/* Mode Switcher */}
            <div className="flex border-b border-slate-100 pb-3 mb-4 space-x-4">
              <button
                type="button"
                onClick={() => setSearchMode('doctors')}
                className={`text-sm font-semibold pb-1 border-b-2 transition-all flex items-center gap-1.5 ${searchMode === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Find Doctors & Clinics</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('labs')}
                className={`text-sm font-semibold pb-1 border-b-2 transition-all flex items-center gap-1.5 ${searchMode === 'labs' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <Activity className="w-4 h-4" />
                <span>Diagnostic Labs & Blood Tests</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={searchMode === 'doctors' ? "Specialty, doctor name, e.g. Cardiologist" : "Test name, e.g. Complete Blood Count, HbA1c"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="City or area, e.g. Mumbai"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[42px] btn-primary text-sm font-semibold shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Medical Specialty Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Clinical Disciplines</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Consult Top Specialists by Department</h2>
          </div>
          <Link to="/doctors" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 mt-2 sm:mt-0">
            Explore all specialties <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading specialties..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {specialties.slice(0, 10).map((spec) => {
              const Icon = specialtyIcons[spec.slug] || Stethoscope;
              return (
                <Link
                  key={spec.id}
                  to={`/doctors?specialty=${spec.slug}`}
                  className="card p-4 hover:border-teal-400 hover:shadow-md transition-all group flex flex-col items-center text-center bg-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-primary transition-colors mb-1">
                    {spec.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{spec.description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. How It Works & Medical Privacy Gatekeeper Highlight */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Built with Medical Integrity</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">A Sovereign, Three-Tier Healthcare Experience</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Patients own their medical records. Doctors only view records when explicitly granted consent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">BookMyShow Slot Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose doctor availability in guaranteed 15-minute intervals. Concurrency-safe transactions prevent double-booking conflicts across real-time patient requests.
              </p>
            </div>

            <div className="card bg-white p-6 relative border-teal-200 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base mb-4">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Gatekeeper Consent Vault</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consulting doctors cannot view past medical history unless the patient authorizes access. Revoke consent at any moment with immediate server-enforced denial.
              </p>
            </div>

            <div className="card bg-white p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Certified Diagnostic Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NABL accredited laboratories upload reports directly into encrypted document storage with standardized naming conventions and cryptographic checksums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Approved Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Verified Practitioners</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Featured Doctors Available This Week</h2>
          </div>
          <Link to="/doctors" className="btn-secondary text-xs py-2 px-3.5">
            View All Doctors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      {/* 5. Diagnostic Laboratories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Accredited Diagnostics</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Partner Pathology Laboratories</h2>
          </div>
          <Link to="/laboratories" className="btn-secondary text-xs py-2 px-3.5">
            Explore Labs & Tests
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerLabs.map(lab => (
            <LaboratoryCard key={lab.id} lab={lab} />
          ))}
        </div>
      </section>
    </div>
  );
}
